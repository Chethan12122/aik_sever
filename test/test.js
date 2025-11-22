// const express = require('express');
// const pool = require('../database/db')
// const router = express.Router();

// router.post('/workouts', async (req, res) => {
//   const { email, duration, image, title, description, level, video, steps, outcomes, category } = req.body;

//   try {
//     const query = `
//       INSERT INTO workout (email, duration, image, title, description, level, video, steps, outcomes, category)
//       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING workout_id
//     `; 
//     const values = [email, duration, image, title, description, level, video, steps, outcomes, category];

//     const result = await pool.query(query, values);

//     res.status(201).json({
//       status: 'success',
//       message: 'Workout added successfully',
//       data: result.rows[0],  // The inserted workout data
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({
//       status: 'error',
//       message: 'Failed to add workout',
//     });
//   }
// });

// module.exports = router;













////////  Workouts  /////


const express = require('express');
const pool = require('../database/db');  
const router = express.Router();

router.post('/workout', async (req, res) => {
  const {  email, duration, image, title, description, level, video, steps, outcomes, category } = req.body;

  if (!email || !duration || !title || !level || !category) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try { 
    const insertworkout = await pool.query(
      `INSERT INTO workouts (email, duration, image, title, description, level, video, steps, outcomes, category)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,     
      [ email, duration, image, title, description, level, video, steps, outcomes, category]
    );

    if (insertworkout.rowCount === 0) {
      return res.status(404).json({ error: 'Failed to insert workout' });
    }

    res.status(200).json({ message: 'Workout created successfully', workout: insertworkout.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

module.exports = router;



