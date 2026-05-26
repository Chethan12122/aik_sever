// firmware/controllers/firmwareController.js
const service = require('../services/firmwareService');
const { BlobServiceClient } = require('@azure/storage-blob');
require('dotenv').config();

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);

const firmwareContainerClient = blobServiceClient.getContainerClient('firmware');

// ─────────────────────────────────────────────────────────────────────────────
// GET /firmware/latest
// Called by Flutter app on launch to check for updates
// ─────────────────────────────────────────────────────────────────────────────
const getLatestFirmware = async (req, res) => {
  try {
    const rows = await service.getLatestFirmware();

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'No firmware available' });
    }

    return res.json(rows[0]);
  } catch (err) {
    console.error('getLatestFirmware error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /firmware/history
// Returns all uploaded versions newest first
// ─────────────────────────────────────────────────────────────────────────────
const getAllFirmware = async (req, res) => {
  try {
    const rows = await service.getAllFirmware();
    return res.json({ success: true, total: rows.length, history: rows });
  } catch (err) {
    console.error('getAllFirmware error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /firmware/upload
// Upload new .bin file — called from your terminal via curl
// ─────────────────────────────────────────────────────────────────────────────
const uploadFirmware = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { version, changelog } = req.body;

    if (!version) {
      return res.status(400).json({
        success: false,
        message: 'version is required in body',
      });
    }

    // Check version already exists
    const existing = await service.getFirmwareByVersion(version);
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: `Version ${version} already exists`,
      });
    }

const blobName = req.file.originalname;

const blockBlobClient =
  firmwareContainerClient.getBlockBlobClient(blobName);

await blockBlobClient.upload(req.file.buffer, req.file.size, {
  blobHTTPHeaders: {
    blobContentType: 'application/octet-stream',
  },
});

const blobUrl = `https://testingblog.blob.core.windows.net/firmware/${blobName}`;

    // Save in DB
    const rows = await service.createFirmware({
      version,
      filename: blobUrl.split('/').pop(),
      file_path: blobUrl,
      file_size: req.file.size,
      changelog: changelog || '',
    });

    console.log(`✅ Firmware v${version} uploaded to Azure`);

    return res.status(201).json({
      success: true,
      message: `Firmware v${version} uploaded successfully`,
      firmware: rows[0],
    });

  } catch (err) {
    console.error('uploadFirmware error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /firmware/rollback/:version
// Roll back to any previous version
// ─────────────────────────────────────────────────────────────────────────────
const rollbackFirmware = async (req, res) => {
  try {
    const { version } = req.params;

    const existing = await service.getFirmwareByVersion(version);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: `Version ${version} not found` });
    }

    const rows = await service.rollbackToVersion(version);

    console.log(`⏪ Rolled back to firmware v${version}`);

    return res.json({
      success:  true,
      message:  `Rolled back to v${version}`,
      firmware: rows[0],
    });
  } catch (err) {
    console.error('rollbackFirmware error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE /firmware/:version
// Delete a specific version and its .bin file from disk
// ─────────────────────────────────────────────────────────────────────────────
const deleteFirmware = async (req, res) => {
  try {
    const { version } = req.params;

    // 1️⃣ Check if firmware exists
    const existing = await service.getFirmwareByVersion(version);
    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Version ${version} not found`,
      });
    }

    // 2️⃣ Prevent deleting latest firmware
    if (existing[0].is_latest) {
      return res.status(400).json({
        success: false,
        message:
          'Cannot delete the current latest firmware. Rollback to another version first.',
      });
    }

    // 3️⃣ Delete from Azure
    const blockBlobClient =
      firmwareContainerClient.getBlockBlobClient(existing[0].filename);

    await blockBlobClient.deleteIfExists();

    // 4️⃣ Delete from DB
    await service.deleteFirmwareByVersion(version);

    console.log(`🗑️ Deleted firmware v${version}`);

    return res.json({
      success: true,
      message: `v${version} deleted`,
    });

  } catch (err) {
    console.error('deleteFirmware error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message,
    });
  }
};
const listAzureFiles = async (req, res) => {
  try {
    const files = [];

    for await (const blob of firmwareContainerClient.listBlobsFlat()) {
      files.push({
        name: blob.name,
        size: blob.properties.contentLength,
        uploaded: blob.properties.lastModified,
      });
    }

    return res.json({
      success: true,
      total: files.length,
      files,
    });

  } catch (err) {
    console.error("listAzureFiles error:", err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  getLatestFirmware,
  getAllFirmware,
  uploadFirmware,
  rollbackFirmware,
  deleteFirmware,
  listAzureFiles, 
};