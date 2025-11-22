const pool = require('../../database/db');

// Create new agility test
const createAgilityTest = async (data) => {
  const { name, email, agility, created_at } = data;
  const query = `
    INSERT INTO agility_test (name, email, agility, created_at)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
  const result = await pool.query(query, [name, email, agility, created_at]);
  return result.rows;
};
// get all agility tests
const getAllAgilityTests = async () => {
  const result = await pool.query(`SELECT * FROM agility_test ORDER BY created_at DESC`);
  return result.rows;
};

// Get agility test by ID
const getAgilityTestById = async (id) => {
  const query = 'SELECT * FROM agility_test WHERE id = $1;';
  const result = await pool.query(query, [id]);
  return result.rows;
};

// Get agility test by Email
const getAgilityTestByEmail = async (email) => {
  const query = 'SELECT * FROM agility_test WHERE email = $1;';
  const result = await pool.query(query, [email]);
  return result.rows;
};

// Update agility test
const updateAgilityTest = async (id, data) => {
  const { name, email, agility, created_at } = data;
  const query = `
    UPDATE agility_test
    SET name = $1, email = $2, agility = $3, created_at = $4
    WHERE id = $5
    RETURNING *;
  `;
  const result = await pool.query(query, [name, email, agility, created_at, id]);
  return result.rows;
};

// Delete agility test
const deleteAgilityTest = async (id) => {
  const query = 'DELETE FROM agility_test WHERE id = $1 RETURNING *;';
  const result = await pool.query(query, [id]);
  return result.rows;
};

module.exports = {
  createAgilityTest,
  getAgilityTestById,
  getAgilityTestByEmail,
  getAllAgilityTests,
  updateAgilityTest,
  deleteAgilityTest,
};
