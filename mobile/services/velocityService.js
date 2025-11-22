const pool = require('../../database/db');

// Create new velocity test
const createVelocityTest = async (data) => {
  const { name, email, velocity, created_at } = data;
  const query = `
    INSERT INTO velocity_test (name, email, velocity, created_at)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const result = await pool.query(query, [name, email, velocity, created_at]);
  return result.rows;
};
// get all velocity tests
const getAllVelocityTests = async () => {
  const result = await pool.query(`SELECT * FROM velocity_test ORDER BY created_at DESC`);
  return result.rows;
};

// Get velocity test by ID
const getVelocityTestById = async (id) => {
  const query = 'SELECT * FROM velocity_test WHERE id = $1;';
  const result = await pool.query(query, [id]);
  return result.rows;
};

// Get velocity test by Email
const getVelocityTestByEmail = async (email) => {
  const query = 'SELECT * FROM velocity_test WHERE email = $1;';
  const result = await pool.query(query, [email]);
  return result.rows;
};

// Update velocity test
const updateVelocityTest = async (id, data) => {
  const { name, email, velocity, created_at } = data;
  const query = `
    UPDATE velocity_test
    SET name = $1, email = $2, velocity = $3, created_at = $4
    WHERE id = $5
    RETURNING *;
  `;
  const result = await pool.query(query, [name, email, velocity, created_at, id]);
  return result.rows;
};

// Delete velocity test
const deleteVelocityTest = async (id) => {
  const query = 'DELETE FROM velocity_test WHERE id = $1 RETURNING *;';
  const result = await pool.query(query, [id]);
  return result.rows;
};

module.exports = {
  createVelocityTest,
  getAllVelocityTests,
  getVelocityTestById,
  getVelocityTestByEmail,
  updateVelocityTest,
  deleteVelocityTest
};
