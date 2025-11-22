// const nodemailer = require('nodemailer');
// require('dotenv').config();

// let transporter = nodemailer.createTransport({
//     service: 'SMTP',
//     host: 'mail.rosettesmartlife.com',
//     port: 465,  
//     secure: true,  
//     auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//         },
// });

// async function sendResetEmail(to, resetLink) {
//   await transporter.sendMail({
//     to,
//     subject: 'Password Reset Request',
//     text: `Click the link to reset your password: ${resetLink}`,
//   });
// }

// async function sendEmail({ to, subject, html }) {
//   await transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html });
// }

 
// module.exports = { sendResetEmail, sendEmail };

 

const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'mail.rosettesmartlife.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  pool: true,
  maxConnections: 3,
  maxMessages: 100,
});

/**
 * Send Password Reset Email
 */
async function sendResetEmail(to, resetLink) {
  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'Password Reset Request',
    text: `Click the link to reset your password: ${resetLink}`,
  }).then(info => {
    console.log(`[RESET] Email sent to ${to}: ${info.messageId}`);
  }).catch(err => {
    console.error(`[RESET] Email failed: ${err.message}`);
  });
}

/**
 * Send General Email (OTP, etc.)
 */
async function sendEmail({ to, subject, html }) {
  transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  }).then(info => {
    console.log(`[EMAIL] Sent to ${to}: ${info.messageId}`);
  }).catch(err => {
    console.error(`[EMAIL] Failed to send to ${to}: ${err.message}`);
  });
}

module.exports = { sendResetEmail, sendEmail };
