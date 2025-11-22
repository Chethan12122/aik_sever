const pool = require('../../database/db');
const { hashPassword, comparePassword } = require('../utils/hash');
const { generateToken } = require('../utils/jwt');

// async function registerUser({ name, email, password }) {
//   // Check if user exists
//   const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
//   if (existing.rows.length > 0) {
//     throw new Error('User already exists');
//   }

//   // Hash password
//   const hashedPassword = await hashPassword(password);

//   // Insert new user
//   const result = await pool.query(
//     'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
//     [name, email, hashedPassword]
//   );

//   return result.rows[0];
// }

async function registerUser({ name, email, password }) {
  // Check if user exists
  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length > 0) {
    throw new Error('User already exists');
  }

  return {
    id: null, 
    name,
    email,
    password
  };
}

 
async function loginUser({ email, password }) {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (result.rows.length === 0) {
    throw new Error('Invalid email or password');
  }

  const user = result.rows[0];

  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    throw new Error('Invalid email or password');
  }

  // Generate JWT token
  const token = generateToken({ userId: user.id, email: user.email });
  return { token };
}

module.exports = {
  registerUser,
  loginUser,
};
