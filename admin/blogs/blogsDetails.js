const express = require('express');
const multer = require('multer');
const { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions } = require('@azure/storage-blob');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Store in memory

// Environment variables
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const AZURE_ACCOUNT_NAME = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const AZURE_ACCOUNT_KEY = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const containerName = process.env.AZURE_CONTAINER_NAME;

// Validate environment variables
if (!AZURE_STORAGE_CONNECTION_STRING || !AZURE_ACCOUNT_NAME || !AZURE_ACCOUNT_KEY || !containerName) {
  console.error('Missing Azure configuration in environment variables');
  throw new Error('Azure configuration is incomplete. Check environment variables.');
}


router.post('/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    // Initialize Blob Service Client
    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Ensure container exists
    const containerExists = await containerClient.exists();
    if (!containerExists) {
      await containerClient.create();
      console.log(`Created container: ${containerName}`);
    }

    // Set container to public access (once)
    await containerClient.setAccessPolicy('blob');

    // Generate unique blob name
    const blobName = `${Date.now()}-${req.file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Upload the image
    await blockBlobClient.upload(req.file.buffer, req.file.size, {
      blobHTTPHeaders: { blobContentType: req.file.mimetype },
    });

    // Generate public URL (no SAS)
    const imageUrl = `https://${AZURE_ACCOUNT_NAME}.blob.core.windows.net/${containerName}/${blobName}`;

    res.status(200).json({ imageUrl });
  } catch (err) {
    console.error('Upload error:', err.message, err.stack);
    res.status(500).json({ error: `Failed to upload image: ${err.message}` });
  }
});


// Keep the /blogs route unchanged for now
router.get('/blogs', async (req, res) => {
  try {
    const response = await axios.get('https://wellnessblog-gaeqe9ejc4gkbddk.canadacentral-01.azurewebsites.net/api/blogs');
    const blogs = response.data;

    const sharedKeyCredential = new StorageSharedKeyCredential(AZURE_ACCOUNT_NAME, AZURE_ACCOUNT_KEY);
    const expiresOn = new Date(Date.now() + 60 * 60 * 24 * 60 * 1000);


    const blogsWithUrls = blogs.map(blog => {
      if (!blog.image) return blog;

      const sasToken = generateBlobSASQueryParameters(
        {
          containerName,
          blobName: blog.image,
          permissions: BlobSASPermissions.parse('r'),
          expiresOn,
        },
        sharedKeyCredential
      ).toString();

      const sasUrl = `https://${AZURE_ACCOUNT_NAME}.blob.core.windows.net/${containerName}/${blog.image}?${sasToken}`;

      return {
        ...blog,
        image: sasUrl,
      };
    });

    res.json(blogsWithUrls);
  } catch (err) {
    console.error('Error fetching blogs or generating SAS URLs:', err.message);
    res.status(500).json({ message: 'Failed to fetch blogs' });
  }
});

module.exports = router; 