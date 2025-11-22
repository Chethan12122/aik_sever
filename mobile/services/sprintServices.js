const pool = require('../../database/db');

const createSprintTest = async ({ name, email, gates, notes }) => {
  const result = await pool.query(
    `INSERT INTO sprint_Test (name, email, gates, notes) VALUES ($1, $2, $3,$4) RETURNING *`,
    [name, email, gates, notes || '']
  );
  return result.rows[0];
};

const getAllSprintTests = async () => {
  const result = await pool.query(`SELECT * FROM sprint_Test ORDER BY created_at DESC`);
  return result.rows;
};

const getSprintTestById = async (id) => {
  const result = await pool.query(`SELECT * FROM sprint_Test WHERE id = $1`, [id]);
  return result.rows;
};

const getSprintTestByEmail = async (email) => {
  const result = await pool.query(`SELECT * FROM sprint_Test WHERE email = $1`, [email]);
  return result.rows;
};

const updateSprintTest = async (id, { name, email, gates, notes }) => {
  const result = await pool.query(
    `UPDATE sprint_Test SET name = $1, email = $2, gates = $3,notes = $4 WHERE id = $5 RETURNING *`,
    [name, email, gates, notes || null, id]
  );
  return result.rows[0];
};

const deleteSprintTest = async (id) => {
  await pool.query(`DELETE FROM sprint_Test WHERE id = $1`, [id]);
  return;
};

module.exports = {
  createSprintTest,
  getAllSprintTests,
  getSprintTestById,
  getSprintTestByEmail,
  updateSprintTest,
  deleteSprintTest,
};
