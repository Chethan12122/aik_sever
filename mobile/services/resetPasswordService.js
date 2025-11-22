const pool = require('../../database/db');
const { hashPassword } = require('../utils/hash');
const { sendResetEmail } = require('../utils/mailer');

async function findUserByEmail(email) {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
}

async function sendPasswordResetEmail(email) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error('User not found');
  }

  const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/api/reset-password?email=${encodeURIComponent(email)}`;
  await sendResetEmail(email, resetLink);
}

async function resetPassword(email, newPassword) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error('User not found');
  }

  const hashedPassword = await hashPassword(newPassword);
  await pool.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPassword, email]);
}

module.exports = {
  sendPasswordResetEmail,
  resetPassword,
  findUserByEmail
};
