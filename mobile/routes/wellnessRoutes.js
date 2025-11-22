const express = require('express');
const router = express.Router();
const pool = require('../../database/db'); // adjust path to your db.js

// ============================
//  POST: Insert Wellness Data
// ============================
router.post('/wellness', async (req, res) => {
  const {
    email, 
    name,
    heart_rate,
    stress_level,
    fatigue_level,
    muscle_soreness,
    mood_level,
    sleep_quality,
    entry_date 
  } = req.body;

  // ✅ Calculate cumulative wellness score (normalized to 100)
  const cumulative_score = ((stress_level + fatigue_level + muscle_soreness + mood_level + sleep_quality) / 25) * 100;

  const query = `
    INSERT INTO daily_wellness
      (email, name, heart_rate, stress_level, fatigue_level, muscle_soreness, mood_level, sleep_quality, cumulative_score, entry_date)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *;
  `;

  const values = [
    email,
    name,
    heart_rate,
    stress_level,
    fatigue_level,
    muscle_soreness,
    mood_level,
    sleep_quality,
    cumulative_score,
    entry_date
  ];

  try {
    const result = await pool.query(query, values);
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error inserting wellness check:', err);
    res.status(500).json({ success: false, message: 'Failed to save wellness check' });
  }
});


// ============================
//  GET: Fetch wellness data for a specific user
// ============================
router.get('/wellness/:email', async (req, res) => {
  const { email } = req.params;

  const query = `
    SELECT name, submitted_at, stress_level, fatigue_level, muscle_soreness, mood_level, sleep_quality, heart_rate, cumulative_score
    FROM daily_wellness
    WHERE email = $1
    ORDER BY submitted_at ASC;
  `;

  try {
    const result = await pool.query(query, [email]);
    res.status(200).json({ success: true, data: result.rows });
  } catch (err) {
    console.error('Error fetching wellness data:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch wellness data' });
  }
});

module.exports = router;
