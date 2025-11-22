// const authService = require('../services/authService');

// const authloginUser = async (req, res) => {
//   const { email } = req.body;

//   if (!email) {
//     return res.status(400).json({ message: 'Email is required' });
//   }

//   try {
//     const user = await authService.findUserByEmail(email);

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
 
//     console.log(`User logged in with ID: ${user.id}`);
//     return res.status(200).json({
//       message: 'Login successful',
//       userId: user.id,
//       email: user.email,
//       name: user.name,
//       firebase_uid: user.firebase_uid
//     });

//   } catch (err) {
//     console.error('Login error:', err);
//     return res.status(500).json({ message: 'Error during login' });
//   }
// };



// module.exports = {
//   authloginUser,
// };



const authService = require('../services/authService');

exports.loginUser = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await authService.findUserByEmail(email);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      message: 'Login successful',
      userId: user.id,
      email: user.email,
      name: user.name,
      firebase_uid: user.firebase_uid
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Error during login' });
  }
};

exports.registerUser = async (req, res) => {
  const { email, name, firebase_uid } = req.body;

  if (!email || !name || !firebase_uid) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const existingUser = await authService.checkUserExists(email, firebase_uid);
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists with this email or firebase_uid' });
    }

    const userId = await authService.createUser(email, name, firebase_uid);

    return res.status(201).json({
      message: 'User registered successfully',
      userId,
      email,
      firebase_uid
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Error saving user data' });
  }
};
