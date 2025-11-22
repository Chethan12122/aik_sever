const { BlobServiceClient } = require('@azure/storage-blob');
require('dotenv').config();

const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_CONTAINER_NAME);

exports.uploadToAzure = async (file) => {
  const blobName = `${Date.now()}_${file.originalname}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.upload(file.buffer, file.size, {
    blobHTTPHeaders: { blobContentType: file.mimetype }
  });

  return `https://${process.env.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/${process.env.AZURE_CONTAINER_NAME}/${blobName}`;
};
