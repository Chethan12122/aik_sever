const express = require('express');
const router = express.Router();
const pool = require('../database/db');

// GET all users
router.get('/useradmin', async (req, res) => {
  try {
    // Query the database to fetch user details with verified_at from users table
    const users = await pool.query(`
      SELECT 
        d.name, 
        d.email, 
        u.verified_at AS joiningDate, 
        d.role, 
        d.gender, 
        d.date_of_birth, 
        d.location, 
        d.intrests 
      FROM details d
      LEFT JOIN users u ON d.email = u.email
    `);
    
    // Check if no users were found
    if (users.rows.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    // Format joiningDate to a consistent string format (e.g., YYYY-MM-DD)
    const formattedUsers = users.rows.map(user => ({
      ...user,
    }));

    // Return the fetched users
    res.status(200).json({ message: 'Users fetched successfully', users: formattedUsers });

  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Internal Server Error', details: err.message });
  }
});

module.exports = router;
