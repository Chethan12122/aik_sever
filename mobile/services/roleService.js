const pool = require('../../database/db');

async function createRole(email, role) {
  const query = `
    INSERT INTO details (email, role)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const values = [email, role];

  const result = await pool.query(query, values);
  return result.rows[0];
}
 
async function updateRole(email, role) {
  // First check if the email already exists in the details table
  const checkQuery = `SELECT 1 FROM details WHERE email = $1`;
  const { rows } = await pool.query(checkQuery, [email]);

  if (rows.length === 0) {
    // Email not found — insert new record
    const insertQuery = `
      INSERT INTO details (email, role)
      VALUES ($1, $2)
      RETURNING *;
    `;
    const insertResult = await pool.query(insertQuery, [email, role]);
    return { ...insertResult.rows[0], action: "created" };
  } else {
    // Email exists — update role
    const updateQuery = `
      UPDATE details
      SET role = $1
      WHERE email = $2
      RETURNING *;
    `;
    const updateResult = await pool.query(updateQuery, [role, email]);
    return { ...updateResult.rows[0], action: "updated" };
  }
}

async function getRoleByEmail(email) {
  const query = `SELECT role, email FROM details WHERE email = $1`;
  const result = await pool.query(query, [email]);

  if (result.rows.length === 0) {
    return null; // No user found
  }

  return result.rows[0];
}


 
const allowedFields = [
  'id', 'email', 'role', 'name', 'gender', 'date_of_birth', 'weight', 
  'height', 'about_me', 'intrests', 'work', 'location', 'primary_sport', 'image_url'
];
 
  async function fetchUsers(fields) {
  let selectedFields = '*';
console.log('Selected fields:', selectedFields);

  if (fields) { 
    const requestedFields = fields
      .split(',')
      .map(f => f.trim())
      .filter(f => allowedFields.includes(f));

    if (requestedFields.length === 0) {
      throw new Error('Invalid fields parameter');
    }

    selectedFields = requestedFields.join(', ');
  }

  const query = `SELECT ${selectedFields} FROM details`;
  const result = await pool.query(query);
  return result.rows;
};
 
const allowedFields1 = [
  'id', 'email', 'role', 'name', 'gender', 'date_of_birth', 'weight',
  'height', 'about_me', 'intrests', 'work', 'location', 'primary_sport', 'image_url'
];

const allowedRoles = ['athlete', 'trainer']; // Add more roles if needed

async function fetchUsers1(fields, role) {
  let selectedFields = '*';

  if (fields) {
    const requestedFields = fields
      .split(',')
      .map(f => f.trim())
      .filter(f => allowedFields1.includes(f));

    if (requestedFields.length === 0) {
      throw new Error('Invalid fields parameter');
    }

    selectedFields = requestedFields.join(', ');
  }

  let query = `SELECT ${selectedFields} FROM details`;
  const queryParams = [];
  
  if (role) {
    if (!allowedRoles.includes(role.toLowerCase())) {
      throw new Error('Invalid role parameter');
    }
    query += ` WHERE role = $1`;
    queryParams.push(role.toLowerCase());
  }

  const result = await pool.query(query, queryParams);
  return result.rows;
}

module.exports = { createRole, updateRole, getRoleByEmail, fetchUsers, fetchUsers1 };

 
