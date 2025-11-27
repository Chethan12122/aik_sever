const pool = require('../../database/db');

const createJumpTest = async ({ name, email, metrics,notes }) => {
  const result = await pool.query(
     `INSERT INTO Jump_Test (name, email, metrics, notes) VALUES ($1, $2, $3, $4) RETURNING *`,
    [name, email, metrics, notes || '']
  );
  return result.rows[0];
};

const getAllJumpTests = async () => {
  const result = await pool.query(`SELECT * FROM Jump_Test ORDER BY created_at DESC`);
  return result.rows;
};

const getJumpTestById = async (id) => {
  const result = await pool.query(`SELECT * FROM Jump_Test WHERE id = $1`, [id]);
  return result.rows;
};

const getJumpTestByEmail = async (email) => {
  const result = await pool.query(`SELECT * FROM Jump_Test WHERE email = $1`, [email]);
  return result.rows;
};

const updateJumpTest = async (id, { name, email, metrics, notes  }) => {
  const result = await pool.query(
    `UPDATE Jump_Test SET name = $1, email = $2, metrics = $3, notes = $4 WHERE id = $5 RETURNING *`,
    [name, email, metrics, notes || null, id]
  );
  return result.rows[0];
};

const deleteJumpTest = async (id) => {
  await pool.query(`DELETE FROM Jump_Test WHERE id = $1`, [id]);
  return;
};

module.exports = {
  createJumpTest,
  getAllJumpTests,
  getJumpTestById,
  getJumpTestByEmail,
  updateJumpTest,
  deleteJumpTest,
};
