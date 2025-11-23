const pool = require('../../database/db');

// Create new agility test
const createAgilityTest = async (data) => {
  const { name, email, agility, created_at, notes } = data; // ✅ Add notes
  const query = `
    INSERT INTO agility_test (name, email, agility, created_at, notes)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;
  const result = await pool.query(query, [name, email, agility, created_at, notes]); // ✅ Add notes parameter
  return result.rows;
};

// Get all agility tests
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
  const query = 'SELECT * FROM agility_test WHERE email = $1 ORDER BY created_at DESC;'; // ✅ Add ordering
  const result = await pool.query(query, [email]);
  return result.rows;
};

// Update agility test
const updateAgilityTest = async (id, data) => {
  const { name, email, agility, created_at, notes } = data; // ✅ Add notes
  const query = `
    UPDATE agility_test
    SET name = $1, email = $2, agility = $3, created_at = $4, notes = $5
    WHERE id = $6
    RETURNING *;
  `;
  const result = await pool.query(query, [name, email, agility, created_at, notes, id]); // ✅ Add notes parameter
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
