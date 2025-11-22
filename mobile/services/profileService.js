const pool = require('../../database/db');

const getProfileByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM details WHERE email = $1', [email]);
  return result.rows[0];
};

const updateProfile = async ({ email, about_me, intrests, achievements, work, location }) => {
  const result = await pool.query(
    `UPDATE details SET about_me = $1, intrests = $2, achievements = $3, work = $4, location = $5 WHERE email = $6 RETURNING *`,
    [about_me, intrests, achievements, work, location, email]
  );
  return result.rows[0];
};

module.exports = {
  getProfileByEmail,
  updateProfile,
};
