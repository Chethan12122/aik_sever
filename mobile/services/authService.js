// const pool = require('../database/db');

// const findUserByEmail = async (email) => {
//   const query = `
//     SELECT id, email, name, firebase_uid
//     FROM users
//     WHERE email = $1
//   `;
//   const values = [email];

//   const result = await pool.query(query, values);
//   return result.rows[0];
// };

// module.exports = {
//   findUserByEmail,
// };



const pool = require('../../database/db');

exports.findUserByEmail = async (email) => {
  const query = `SELECT id, email, name, firebase_uid FROM users WHERE email = $1`;
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

exports.checkUserExists = async (email, firebase_uid) => {
  const query = `SELECT id FROM users WHERE email = $1 OR firebase_uid = $2`;
  const result = await pool.query(query, [email, firebase_uid]);
  return result.rows.length > 0;
};

exports.createUser = async (email, name, firebase_uid) => {
  const query = `
    INSERT INTO users (email, name, firebase_uid)
    VALUES ($1, $2, $3)
    RETURNING id
  `;
  const result = await pool.query(query, [email, name, firebase_uid]);
  return result.rows[0].id;
};
