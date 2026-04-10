const pool = require('../../database/db');

async function addFavorite(email, workoutId) {
  const query = `
    INSERT INTO favorite_workouts (email, workout_id)
    VALUES ($1, $2)
    ON CONFLICT (email, workout_id) DO NOTHING
    RETURNING *;
  `;
  const values = [email.toLowerCase(), workoutId];
  const result = await pool.query(query, values);
  return result.rows[0];
}

async function removeFavorite(email, workoutId) {
  const query = `
    DELETE FROM favorite_workouts
    WHERE email = $1 AND workout_id = $2
    RETURNING *;
  `;
  const values = [email.toLowerCase(), workoutId];
  const result = await pool.query(query, values);
  return result.rows[0];
}

async function getFavoriteWorkoutsByEmail(email) {
  const query = `
    SELECT w.*
    FROM favorite_workouts f
    JOIN workouts w ON f.workout_id = w.workout_id
    WHERE f.email = $1
    ORDER BY f.created_at DESC;
  `;
  const values = [email.toLowerCase()];
  const result = await pool.query(query, values);
  return result.rows;
}

async function isFavorite(email, workoutId) {
  const query = `
    SELECT 1
    FROM favorite_workouts
    WHERE email = $1 AND workout_id = $2
    LIMIT 1;
  `;
  const values = [email.toLowerCase(), workoutId];
  const result = await pool.query(query, values);
  return result.rows.length > 0;
}

module.exports = {
  addFavorite,
  removeFavorite,
  getFavoriteWorkoutsByEmail,
  isFavorite,
};