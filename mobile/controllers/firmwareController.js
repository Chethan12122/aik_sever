// firmware/controllers/firmware.controller.js
const path    = require('path');
const fs      = require('fs');
const service = require('../services/firmwareService');

const UPLOADS_DIR = path.join(__dirname, '../uploads');

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
      fs.unlinkSync(req.file.path); // clean up file if version missing
      return res.status(400).json({ success: false, message: 'version is required in body' });
    }

    // Check version doesn't already exist
    const existing = await service.getFirmwareByVersion(version);
    if (existing.length > 0) {
      fs.unlinkSync(req.file.path);
      return res.status(409).json({
        success: false,
        message: `Version ${version} already exists. Use a new version number.`,
      });
    }

    const fileUrl  = `https://aik-sever.onrender.com/api/firmware/uploads/${req.file.filename}`;
    // const fileUrl  = `https://aikyam-hkfac5a0c6h5bqhe.centralindia-01.azurewebsites.net/api/firmware/uploads/${req.file.filename}`;
    const rows = await service.createFirmware({
      version,
      filename:  req.file.filename,
      file_path: fileUrl,
      file_size: req.file.size,
      changelog: changelog || '',
    });

    console.log(`✅ Firmware v${version} uploaded (${req.file.size} bytes)`);

    return res.status(201).json({
      success:  true,
      message:  `Firmware v${version} uploaded successfully`,
      firmware: rows[0],
    });
  } catch (err) {
    console.error('uploadFirmware error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
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

    const existing = await service.getFirmwareByVersion(version);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: `Version ${version} not found` });
    }

    if (existing[0].is_latest) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete the current latest firmware. Rollback to another version first.',
      });
    }

    // Delete file from disk
    const filePath = path.join(UPLOADS_DIR, existing[0].filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await service.deleteFirmwareByVersion(version);

    console.log(`🗑️  Deleted firmware v${version}`);

    return res.json({ success: true, message: `v${version} deleted` });
  } catch (err) {
    console.error('deleteFirmware error:', err);
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

module.exports = {
  getLatestFirmware,
  getAllFirmware,
  uploadFirmware,
  rollbackFirmware,
  deleteFirmware,
};