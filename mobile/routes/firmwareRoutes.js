// firmware/routes/firmware.routes.js
const express    = require('express');
const multer     = require('multer');
const path       = require('path');
const fs         = require('fs');
const controller = require('../controllers/firmwareController');

const router = express.Router();

// ── Multer config ─────────────────────────────────────────────────────────────
const UPLOADS_DIR = path.join(__dirname, '../uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    cb(null, file.originalname); // keep original filename
  },
});


const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
  fileFilter: (req, file, cb) => {
    if (path.extname(file.originalname).toLowerCase() !== '.bin') {
      return cb(new Error('Only .bin firmware files are allowed'));
    }
    cb(null, true);
  },
});

// ── Serve .bin files statically ───────────────────────────────────────────────
// GET /firmware/uploads/firmware_v1.2.bin
router.use('/firmware/uploads', express.static(UPLOADS_DIR));

// ── Routes (all public) ───────────────────────────────────────────────────────

// Flutter app calls this on launch
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

// ── Multer error handler ──────────────────────────────────────────────────────
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next(err);
});

module.exports = router;