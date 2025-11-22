const express = require('express');
const router = express.Router();
const resetPasswordController = require('../controllers/resetPasswordController');

router.use(express.urlencoded({ extended: true }));

router.post('/request-password-reset', resetPasswordController.requestPasswordReset);
router.get('/reset-password', resetPasswordController.getResetPasswordPage);
router.post('/reset-password', resetPasswordController.resetPassword);

module.exports = router;
