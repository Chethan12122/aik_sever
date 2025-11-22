const express = require('express');
const router = express.Router();
const pool = require('../../database/db');

// POST: Insert Load Monitoring
router.post('/load', async (req, res) => {
    const { email,name, rpe, duration,entry_date } = req.body;
    const load = rpe * duration;

    const query = `
        INSERT INTO load_monitoring (email, name,rpe, duration, load,entry_date)
        VALUES ($1, $2, $3, $4,$5,$6) RETURNING *;
    `;
    try {
        const result = await pool.query(query, [email,name, rpe, duration, load,entry_date]);
        res.status(201).json({ success: true, data: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to save load monitoring' });
    }
});

// GET: Fetch load data for a user
router.get('/load/:email', async (req, res) => {
    const { email } = req.params;

    const query = `
        SELECT submitted_at, name,rpe, duration, load
        FROM load_monitoring
        WHERE email = $1
        ORDER BY submitted_at ASC;
    `;
    try {
        const result = await pool.query(query, [email]);
        res.status(200).json({ success: true, data: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch load data' });
    }
});

module.exports = router;
