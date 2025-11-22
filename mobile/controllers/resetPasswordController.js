const path = require('path');
const resetPasswordService = require('../services/resetPasswordService');
async function requestPasswordReset(req, res) {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    await resetPasswordService.sendPasswordResetEmail(email);
    res.status(200).json({ message: 'Password reset link has been sent to your email' });
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ message: error.message });
    }
    console.error('Error during password reset request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function getResetPasswordPage(req, res) {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const user = await resetPasswordService.findUserByEmail(email);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.sendFile(path.join(__dirname, '../../public/resetpassword.html'));
  } catch (error) {
    console.error('Error loading reset password page:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function resetPassword(req, res) {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res.status(400).json({ message: 'Email and new password are required' });
  }

  try {
    await resetPasswordService.resetPassword(email, newPassword);

    const successMessage = `
      <html>
        <body style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h2 style="color: #4CAF50;">Password Reset Successful!</h2>
          <p style="font-size: 18px; color: #555;">Your password has been successfully reset.</p>
          <p style="font-size: 16px; color: #555;">You can now log in with your new password.</p>
        </body>
      </html>
    `;

    res.status(200).send(successMessage);
  } catch (error) {
    if (error.message === 'User not found') {
      return res.status(404).json({ message: error.message });
    }
    console.error('Error during password reset:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  requestPasswordReset,
  getResetPasswordPage,
  resetPassword,
};
