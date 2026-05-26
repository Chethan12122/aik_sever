const express = require('express');
const router = express.Router();
const pool = require('../../database/db'); // ✅ correct

// ── POST /api/trainer/assign ─────────────────────────────────
router.post('/trainer/assign', async (req, res) => {
  const { trainer_email, athlete_email, workout_ids } = req.body;

  if (
    !trainer_email ||
    !athlete_email ||
    !Array.isArray(workout_ids) ||
    workout_ids.length === 0
  ) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    for (const workout_id of workout_ids) {
      await pool.query(   // ✅ FIXED
        `INSERT INTO trainer_prescriptions (trainer_email, athlete_email, workout_id)
         VALUES ($1, $2, $3)
         ON CONFLICT DO NOTHING`,
        [trainer_email, athlete_email, workout_id]
      );
    }

    return res.status(201).json({ message: 'Workouts assigned successfully.' });
  } catch (err) {
    console.error('Error assigning workouts:', err);
    return res.status(500).json({ error: 'Database error.' });
  }
});


// ── GET /api/trainer/prescribed/:athlete_email ───────────────
router.get('/trainer/prescribed/:athlete_email', async (req, res) => {
  const { athlete_email } = req.params;

  try {
    const result = await pool.query(   // ✅ FIXED
      `SELECT
         w.*,
         tp.assigned_at,
         tp.trainer_email,
         u.name AS trainer_name
       FROM trainer_prescriptions tp
       JOIN workouts w ON w.workout_id::text = tp.workout_id
       LEFT JOIN users u ON u.email = tp.trainer_email
       WHERE tp.athlete_email = $1
       ORDER BY tp.assigned_at DESC`,
      [athlete_email]
    );

    return res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error fetching prescribed workouts:', err);
    return res.status(500).json({ error: 'Database error.' });
  }
});


// ── GET /api/users ───────────────────────────────────────────
router.get('/users', async (req, res) => {
  try {
    const result = await pool.query(   // ✅ FIXED
      `SELECT email, name, role FROM users ORDER BY name ASC`
    );

    return res.status(200).json({ users: result.rows });
  } catch (err) {
    console.error('Error fetching users:', err);
    return res.status(500).json({ error: 'Database error.' });
  }
});

module.exports = router;