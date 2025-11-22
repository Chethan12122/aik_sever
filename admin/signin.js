
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { getOtpStore } = require('./sendOtp');

// Function to get admin data from environment variables
function getAdmins() {
  return [
    { email: process.env.ADMIN_1_EMAIL, password: process.env.ADMIN_1_PASSWORD },
    { email: process.env.ADMIN_2_EMAIL, password: process.env.ADMIN_2_PASSWORD },
    { email: process.env.ADMIN_3_EMAIL, password: process.env.ADMIN_3_PASSWORD },
  ];
}

router.post('/verifyOtpadmin', async (req, res) => {
  const { email, password, otp } = req.body;
  const normalizedEmail = email.toLowerCase(); // Normalize email

  // Fetch admins from environment variables
  const admins = getAdmins();
  const admin = admins.find(admin => admin.email.toLowerCase() === normalizedEmail);
  if (!admin) {
    return res.status(404).json({ success: false, message: 'Admin not found' });
  }

  // Verify password
  const match = await bcrypt.compare(password, admin.password);
  if (!match) {
    return res.status(401).json({ success: false, message: 'Incorrect password' });
  }

  // Fetch OTP from in-memory store
  const otpData = getOtpStore().get(normalizedEmail);
  console.log("Retrieved OTP for", normalizedEmail, ":", otpData);
  if (!otpData || otpData.expires < Date.now()) {
    return res.status(401).json({ success: false, message: 'OTP expired or not found' });
  }

  if (otp !== otpData.otp) {
    return res.status(401).json({ success: false, message: 'Invalid OTP' });
  }

  // Delete OTP after successful verification
  getOtpStore().delete(normalizedEmail);
  console.log("Deleted OTP for", normalizedEmail);

  res.json({ success: true, message: 'Admin logged in successfully', admin: { email: admin.email } });
});

module.exports = router;