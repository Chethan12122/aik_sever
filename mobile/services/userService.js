// const pool = require('../../database/db');

// const getAllUsers = async () => {
//   const result = await pool.query('SELECT * FROM details');
//   return result.rows;
// };

// const getUserByEmail = async (email) => {
//   const result = await pool.query('SELECT * FROM details WHERE email = $1', [email]);
//   return result.rows[0];
// };

// // const updateUserDetails = async (email, { role, name, gender, date_of_birth, weight, height }) => {
// //   const updateQuery = `
// //     UPDATE details
// //     SET role = $1, name = $2, gender = $3, date_of_birth = $4, weight = $5, height = $6
// //     WHERE email = $7
// //     RETURNING *;
// //   `;
// //   const result = await pool.query(updateQuery, [role, name, gender, date_of_birth, weight, height, email]);
// //   return result.rows[0];
// // };

// // const updateUserDetails = async (email, {
// //   role, name, gender, date_of_birth, weight, height,
// //   about_me, intrests, achievements, work, location, primary_sport
// // }) => {
// //   const updateQuery = `
// //     UPDATE details
// //     SET role = $1,
// //         name = $2,
// //         gender = $3,
// //         date_of_birth = $4,
// //         weight = $5,
// //         height = $6,
// //         about_me = $7,
// //         intrests = $8,
// //         achievements = $9,
// //         work = $10,
// //         location = $11,
// //         primary_sport = $12
// //     WHERE email = $13
// //     RETURNING *;
// //   `;

// //   const values = [
// //     role, name, gender, date_of_birth, weight, height,
// //     about_me, intrests, achievements, work, location, primary_sport,
// //     email
// //   ];

// //   const result = await pool.query(updateQuery, values);
// //   return result.rows[0];
// // };

// const updateUserDetails = async (email, {
//   role, name, gender, date_of_birth, weight, height,
//   about_me, intrests, achievements, work, location, primary_sport,
//   image_url
// }) => {
//   const updateQuery = `
//     UPDATE details
//     SET role = $1,
//         name = $2,
//         gender = $3,
//         date_of_birth = $4,
//         weight = $5,
//         height = $6,
//         about_me = $7,
//         intrests = $8,
//         achievements = $9,
//         work = $10,
//         location = $11,
//         primary_sport = $12,
//         image_url = $13
//     WHERE email = $14
//     RETURNING *;
//   `;

//   const values = [
//     role, name, gender, date_of_birth, weight, height,
//     about_me, intrests, achievements, work, location, primary_sport,
//     image_url, email
//   ];

//   const result = await pool.query(updateQuery, values);
//   return result.rows[0];
// };

// module.exports = {
//   getAllUsers,
//   getUserByEmail,
//   updateUserDetails,
// };



const pool = require('../../database/db');

const getAllUsers = async () => {
  const result = await pool.query('SELECT * FROM details');
  return result.rows;
};

const fetchAllUSers = async () => {
  const result = await pool.query('SELECT * FROM users');
  return result.rows;
};

const getUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM details WHERE email = $1', [email]);
  return result.rows[0];
};

const updateUserDetails = async (email, {
  role, name, gender, date_of_birth, weight, height,
  about_me, intrests, work, location, primary_sport,
  image_url
}) => {
  const updateQuery = `
    UPDATE details
    SET role = $1,
        name = $2,
        gender = $3,
        date_of_birth = $4,
        weight = $5,
        height = $6,
        about_me = $7,
        intrests = $8,
        work = $9,
        location = $10,
        primary_sport = $11,
        image_url = COALESCE($12, image_url)
    WHERE email = $13
    RETURNING *;
  `;

  const values = [
    role, name, gender, date_of_birth, weight, height,
    about_me, intrests, work, location, primary_sport,
    image_url, email
  ];

  const result = await pool.query(updateQuery, values);
  return result.rows[0];
};

module.exports = {
  getAllUsers,
  getUserByEmail,
  updateUserDetails,
  fetchAllUSers
};