const pool = require('../../database/db');
const bcrypt = require('bcrypt');
const { sendEmail } = require('../utils/mailer');
const { generateOtp, validateOtp } = require('../utils/otpManager');

async function sendOtpEmail(name, email) {
  // Check if email exists already
  const { rows } = await pool.query('SELECT 1 FROM users WHERE email = $1', [email]);
  if (rows.length > 0) throw new Error('Email already in use');

  const otp = generateOtp(email);

  // Load and replace OTP in email template
  const templatePath = require('path').join(__dirname, '../../presentation/email-template.html');
  const template = require('fs').readFileSync(templatePath, 'utf8');
  const html = template.replace('{{OTP}}', otp);

  await sendEmail({ to: email, subject: 'OTP Code for Aikyam Sports Science', html });
  return otp;
}

async function verifyOtpAndRegisterUser(name, email, userOtp, password) {
  const isValidOtp = validateOtp(email, userOtp);
  if (!isValidOtp) throw new Error('Invalid OTP');

  // Check if email already exists just in case
  const { rows } = await pool.query('SELECT 1 FROM users WHERE email = $1', [email]);
  if (rows.length > 0) throw new Error('Email already in use');

  const hashedPassword = await bcrypt.hash(password, 10);
  const insertResult = await pool.query(
    'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id',
    [name, email, hashedPassword]
  );

  return insertResult.rows[0].id;
}

module.exports = { sendOtpEmail, verifyOtpAndRegisterUser };
