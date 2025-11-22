// const express = require('express'); 
// const router = express.Router();
// const nodemailer = require('nodemailer');
// const bcrypt = require('bcrypt');
// const fs = require('fs');
// const path = require('path');
// require('dotenv').config();

// // In-memory OTP store
// const otpStore = new Map();

// // Function to load the HTML template and inject the OTP
// function getEmailHtml(otp) {
//   const templatePath = path.join(__dirname, '../presentation/email-template.html');
//   try {
//     const template = fs.readFileSync(templatePath, 'utf8');
//     return template.replace('{{OTP}}', otp);
//   } catch (err) {
//     console.error("Error reading email template:", err);
//     return `<p>Your OTP is: <strong>${otp}</strong></p>`;
//   }
// }

// // Function to get admin data from environment variables
// function getAdmins() {
//   return [
//     { email: process.env.ADMIN_1_EMAIL, password: process.env.ADMIN_1_PASSWORD },
//     { email: process.env.ADMIN_2_EMAIL, password: process.env.ADMIN_2_PASSWORD },
//     { email: process.env.ADMIN_3_EMAIL, password: process.env.ADMIN_3_PASSWORD },
//   ];
// }

// router.post('/sendOtpadmin', async (req, res) => {
//   const { email, password } = req.body;
//   const normalizedEmail = email.toLowerCase();  

//   // Fetch admins from environment variables
//   const admins = getAdmins();
//   const admin = admins.find(admin => admin.email.toLowerCase() === normalizedEmail);
//   if (!admin) {
//     return res.status(403).json({ success: false, message: 'Unauthorized email' });
//   }

//   const match = await bcrypt.compare(password, admin.password);
//   if (!match) {
//     return res.status(401).json({ success: false, message: 'Incorrect password' });
//   }

//   // Generate and store OTP in-memory
//   const adminOtp = Math.floor(100000 + Math.random() * 900000).toString();  
//   otpStore.set(normalizedEmail, { otp: adminOtp, expires: Date.now() + 600000 }); 
//   console.log("Stored OTP for", normalizedEmail, ":", adminOtp, "Expires:", new Date(Date.now() + 600000));

//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   const htmlContent = getEmailHtml(adminOtp);
//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: 'Aikyam Admin OTP Verification',
//     html: htmlContent,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     res.status(200).json({ success: true, message: 'OTP sent successfully' });
//   } catch (err) {
//     console.error('SendMail Error:', err);
//     res.status(500).json({ success: false, message: 'Failed to send OTP', error: err.message });
//   }
// });

// // Clean up expired OTPs periodically
// setInterval(() => {
//   const now = Date.now();
//   for (const [email, { expires }] of otpStore) {
//     if (expires < now) {
//       console.log("Cleaning up expired OTP for", email);
//       otpStore.delete(email);
//     }
//   }
// }, 120000); 

// module.exports = {
//   router,
//   getOtpStore: () => otpStore,
// };


const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// In-memory OTP store
const otpStore = new Map();

// Function to load the HTML template and inject the OTP
function getEmailHtml(otp) {
  const templatePath = path.join(__dirname, '../presentation/email-template.html');
  try {
    const template = fs.readFileSync(templatePath, 'utf8');
    return template.replace('{{OTP}}', otp);
  } catch (err) {
    console.error("Error reading email template:", err);
    return `<p>Your OTP is: <strong>${otp}</strong></p>`;
  }
}

// Function to get admin data from environment variables
function getAdmins() {
  return [
    { email: process.env.ADMIN_1_EMAIL, password: process.env.ADMIN_1_PASSWORD },
    { email: process.env.ADMIN_2_EMAIL, password: process.env.ADMIN_2_PASSWORD },
    { email: process.env.ADMIN_3_EMAIL, password: process.env.ADMIN_3_PASSWORD },
  ];
}

router.post('/sendOtpadmin', async (req, res) => {
  const { email, password } = req.body;

  // Validate presence of email and password
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }
  if (!password) {
    return res.status(400).json({ success: false, message: 'Password is required' });
  }

  const normalizedEmail = email.toLowerCase(); // Normalize email

  // Fetch admins from environment variables
  const admins = getAdmins();
  const admin = admins.find(admin => admin.email.toLowerCase() === normalizedEmail);
  if (!admin) {
    return res.status(403).json({ success: false, message: 'Unauthorized email' });
  }

  // Compare hashed password (stored in env) with plain password sent
  const match = await bcrypt.compare(password, admin.password);
  if (!match) {
    return res.status(401).json({ success: false, message: 'Incorrect password' });
  }

  // Generate and store OTP in-memory
  const adminOtp = Math.floor(100000 + Math.random() * 900000).toString(); // Store as string
  otpStore.set(normalizedEmail, { otp: adminOtp, expires: Date.now() + 600000 }); // 10-minute expiration
  console.log("Stored OTP for", normalizedEmail, ":", adminOtp, "Expires:", new Date(Date.now() + 600000));

  // const transporter = nodemailer.createTransport({
  //   service: 'gmail',
  //   auth: {
  //     user: process.env.EMAIL_USER,
  //     pass: process.env.EMAIL_PASS,
  //   },
  // });
  const transporter = nodemailer.createTransport({
          service: 'SMTP',
          host: 'mail.rosettesmartlife.com',
          port: 465,  
          secure: true,  
          auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
          }, 
      });

  const htmlContent = getEmailHtml(adminOtp);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Aikyam Admin OTP Verification',
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (err) {
    console.error('SendMail Error:', err);
    res.status(500).json({ success: false, message: 'Failed to send OTP', error: err.message });
  }
});

// Clean up expired OTPs periodically
setInterval(() => {
  const now = Date.now();
  for (const [email, { expires }] of otpStore) {
    if (expires < now) {
      console.log("Cleaning up expired OTP for", email);
      otpStore.delete(email);
    }
  }
}, 120000); // Run every 2 minutes

module.exports = {
  router,
  getOtpStore: () => otpStore,
};
