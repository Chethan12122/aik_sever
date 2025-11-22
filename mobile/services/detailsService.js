// const pool = require('../../database/db');

// const updateDetails = async ({ email, name, gender, dob, weight, height }) => {
//   const result = await pool.query(
//     `UPDATE details
//      SET name = $1, gender = $2, date_of_birth = $3, weight = $4, height = $5
//      WHERE email = $6 RETURNING *`,
//     [name, gender, dob, weight, height, email]
//   );
//   return result.rows[0];
// };

// module.exports = {
//   updateDetails,
// };


const pool = require('../../database/db');

const updateDetails = async ({ email, name, gender, dob, weight, height, primarySport }) => {
  const result = await pool.query(
    `UPDATE details
     SET name = $1, gender = $2, date_of_birth = $3, weight = $4, height = $5, 
         primary_sport = $6
     WHERE email = $7 RETURNING *`,
    [name, gender, dob, weight, height, primarySport, email]
  );
  return result.rows[0];
};

module.exports = {
  updateDetails,
};
