const express = require('express');
const router = express.Router();
const pool = require('../database/db');  

router.post('/adminMeeting', async (req, res) => {
 const { name, occupation, email, organization, contact_mode, phone_number, purpose, remarks } = req.body;
  try {
const result = await pool.query(
      `INSERT INTO a_meeting (name, occupation, email, organization, contact_mode, phone_number, purpose, remarks)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,     
      [ name, occupation, email, organization, contact_mode, phone_number, purpose, remarks]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'Details updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

router.get('/adminMeeting', async (req, res) => {
    try {
      const users = await pool.query('SELECT * FROM a_meeting');
      if (users.rows.length === 0) {
        return res.status(404).send({ message: 'No users found' });
      }
      res.status(200).send({ message: 'Users fetched successfully', users: users.rows });
    } catch (err) {
      console.error('Error fetching users:', err); 
      res.status(500).send({ message: 'Internal Server Error', details: err.message });
    }
  });
  

router.delete('/adminMeeting', async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ success: false, message: 'ID is required' });
  }
  try {
    const result = await pool.query('DELETE FROM a_meeting WHERE id = $1', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'Meeting not found' });
    }

    res.json({ success: true, message: 'Meeting deleted successfully' });
  } catch (error) {
    console.error('Error deleting meeting:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});


module.exports = router;