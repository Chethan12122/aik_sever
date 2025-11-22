// const authService = require('../services/otpService');

// async function sendOtp(req, res) {
//   const { name, email, password } = req.body;
//   if (!email || !password || !name) {
//     return res.status(400).json({ success: false, error: 'Name, email, and password are required' });
//   }
//   try {
//     await authService.sendOtpEmail(name, email);
//     res.json({ success: true, message: 'OTP sent successfully' });
//   } catch (error) {
//     res.status(400).json({ success: false, error: error.message });
//   }
// }

// async function verifyOtp(req, res) {
//   const { name, email, userOtp, password } = req.body;
//   if (!email || !userOtp || !password || !name) {
//     return res.status(400).json({ verified: false, error: 'Name, email, OTP and password are required' });
//   }
//   try {
//     const userId = await authService.verifyOtpAndRegisterUser(name, email, userOtp, password);
//     res.json({ verified: true, message: 'OTP verified and user registered successfully', userId });
//   } catch (error) {
//     res.status(400).json({ verified: false, error: error.message });
//   }
// }

// module.exports = { sendOtp, verifyOtp };
 
// Working without Redis

// const authService = require('../services/otpService');

// const pendingUsers = new Map(); // email => { name, password }
// // this only works for the small scale and to fix it use redis cache

// async function sendOtp(req, res) {
//   const { name, email, password } = req.body;
//   if (!email || !password || !name) {
//     return res.status(400).json({ success: false, error: 'Name, email, and password are required' });
//   }
//   try {
//     await authService.sendOtpEmail(name, email);
//     // Save user info temporarily
//     pendingUsers.set(email, { name, password });
//     res.json({ success: true, message: 'OTP sent successfully' });
//   } catch (error) {
//     res.status(400).json({ success: false, error: error.message });
//   }
// }

// async function verifyOtp(req, res) {
//   const { email, userOtp } = req.body;
//   if (!email || !userOtp) {
//     return res.status(400).json({ verified: false, error: 'Email and OTP required' });
//   }

//   const pendingUser = pendingUsers.get(email);
//   if (!pendingUser) {
//     return res.status(400).json({ verified: false, error: 'No pending registration for this email' });
//   }

//   try {
//     const userId = await authService.verifyOtpAndRegisterUser(pendingUser.name, email, userOtp, pendingUser.password);
//     // Registration complete, remove from pending users
//     pendingUsers.delete(email);
//     res.json({ verified: true, message: 'OTP verified and user registered successfully', userId });
//   } catch (error) {
//     res.status(400).json({ verified: false, error: error.message });
//   }
// }

// module.exports = { sendOtp, verifyOtp };


// With Redis Cache

const authService = require('../services/otpService');
const redisClient = require('../utils/redis_cache'); 

const OTP_EXPIRY_SECONDS = 5 * 60; // 5 minutes

async function sendOtp(req, res) {
  const { name, email, password } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ success: false, error: 'Name, email, and password are required' });
  }

  const normalizedEmail = email.toLowerCase();

  try {
    // Save user info in Redis BEFORE sending OTP
    const userData = JSON.stringify({ name, password });
    await redisClient.setEx(`pendingUser:${normalizedEmail}`, OTP_EXPIRY_SECONDS, userData);

    await authService.sendOtpEmail(name, normalizedEmail);

    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    // Optional: clean up on failure
    await redisClient.del(`pendingUser:${normalizedEmail}`);
    res.status(400).json({ success: false, error: error.message });
  }
}

// async function verifyOtp(req, res) {
//   const { email, userOtp } = req.body;
//   if (!email || !userOtp) {
//     return res.status(400).json({ verified: false, error: 'Email and OTP required' });
//   }

//   const normalizedEmail = email.toLowerCase();
//   try {
//     const userDataString = await redisClient.get(`pendingUser:${normalizedEmail}`);
//     if (!userDataString) {
//       return res.status(400).json({ verified: false, error: 'No pending registration for this email in Redis' });
//     }

//     const { name, password } = JSON.parse(userDataString);

//     const userId = await authService.verifyOtpAndRegisterUser(name, normalizedEmail, userOtp, password);

//     // Clean up
//     await redisClient.del(`pendingUser:${normalizedEmail}`);

//     res.json({ verified: true, message: 'OTP verified and user registered successfully', userId });
//   } catch (error) {
//     res.status(400).json({ verified: false, error: error.message });
//   }
// }

async function verifyOtp(req, res) {
  const { email, userOtp } = req.body;
  if (!email || !userOtp) {
    return res.status(400).json({ verified: false, error: 'Email and OTP required' });
  }

  const normalizedEmail = email.toLowerCase();
  try {
    // Log the normalized email and attempt to retrieve data
    console.log(`Attempting to fetch Redis data for: ${normalizedEmail}`);
    const userDataString = await redisClient.get(`pendingUser:${normalizedEmail}`);
    console.log(`Fetched data from Redis for ${normalizedEmail}:`, userDataString);

    if (!userDataString) {
      return res.status(400).json({ verified: false, error: 'No pending registration for this email in Redis' });
    }

    const { name, password } = JSON.parse(userDataString);
    console.log(`User data from Redis: Name: ${name}, Password: ${password}`);

    const userId = await authService.verifyOtpAndRegisterUser(name, normalizedEmail, userOtp, password);

    // Clean up Redis
    await redisClient.del(`pendingUser:${normalizedEmail}`);
    console.log(`Deleted Redis key for ${normalizedEmail}`);

    res.json({ verified: true, message: 'OTP verified and user registered successfully', userId });
  } catch (error) {
    console.error(`Error during OTP verification for ${normalizedEmail}:`, error.message);
    res.status(400).json({ verified: false, error: error.message });
  }
}

module.exports = { sendOtp, verifyOtp };
