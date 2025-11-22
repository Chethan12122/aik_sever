const authService = require('../services/auth_manualService');

async function register(req, res) {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ status: 'error', message: 'Missing required fields' });
  }

  try {
    const user = await authService.registerUser({ name, email, password });
    res.status(200).json({
      status: 'success',
      message: 'User registered successfully',
      // user: { id: user.id, email: user.email, name: user.name },
      email:user.email,
      name:user.name
    });
  } catch (error) {
    if (error.message === 'User already exists') {
      return res.status(400).json({ status: 'error', message: error.message });
    }
    console.error('Registration error:', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const { token } = await authService.loginUser({ email, password });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    if (error.message === 'Invalid email or password') {
      return res.status(401).json({ message: error.message });
    }
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = { register, login };
