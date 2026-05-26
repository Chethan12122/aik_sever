// firmware/routes/firmwareRoutes.js
const express    = require('express');
const multer     = require('multer');
const path = require('path');
const controller = require('../controllers/firmwareController');

const router = express.Router();

// ── Multer config ─────────────────────────────────────────────────────────────


const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() !== '.bin') {
      return cb(new Error('Only .bin firmware files are allowed'));
    }
    cb(null, true);
  },
});

// GET /firmware/latest
router.get('/firmware/latest', controller.getLatestFirmware);

// All versions history
// GET /firmware/history
router.get('/firmware/history', controller.getAllFirmware);

// Upload new firmware
// POST /firmware/upload
router.post('/firmware/upload', upload.single('firmware'), controller.uploadFirmware);

// Roll back to previous version
// POST /firmware/rollback/1.1
router.post('/firmware/rollback/:version', controller.rollbackFirmware);

// Delete a version
// DELETE /firmware/1.0
router.delete('/firmware/:version', controller.deleteFirmware);
router.get('/firmware/azure-files', controller.listAzureFiles);

// ── Multer error handler ──────────────────────────────────────────────────────
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next(err);
});

module.exports = router;