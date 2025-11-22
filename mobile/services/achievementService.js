const pool = require('../../database/db');

async function getAllAchievements(email) {
  if (email) {
    const res = await pool.query('SELECT * FROM achievements WHERE email = $1 ORDER BY achievement_date DESC', [email]);
    return res.rows;
  } else {
    const res = await pool.query('SELECT * FROM achievements ORDER BY achievement_date DESC LIMIT 100');
    return res.rows;
  }
}

async function getAchievementById(id) {
  const res = await pool.query('SELECT * FROM achievements WHERE id = $1', [id]);
  return res.rows[0];
}

async function createAchievement(data) {
  const { title, issued_by, achievement_date, sports, image_url, email } = data;
  const res = await pool.query(
    `INSERT INTO achievements (title, issued_by, achievement_date, sports, image_url, email)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [title, issued_by, achievement_date, sports, image_url, email]
  );
  return res.rows[0];
}

async function updateAchievement(id, data) {
  const { title, issued_by, achievement_date, sports, image_url } = data;
  const res = await pool.query(
    `UPDATE achievements SET title=$1, issued_by=$2, achievement_date=$3, sports=$4, image_url=$5 WHERE id=$6 RETURNING *`,
    [title, issued_by, achievement_date, sports, image_url, id]
  );
  return res.rows[0];
}

async function deleteAchievement(id) {
  await pool.query('DELETE FROM achievements WHERE id = $1', [id]);
  return true;
}

module.exports = {
  getAllAchievements,
  getAchievementById,
  createAchievement,
  updateAchievement,
  deleteAchievement,
};
