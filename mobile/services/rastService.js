// const pool = require('../../database/db');

// exports.createUser = async (userData) => {
//   const { name, email, sets } = userData;

//   const query = `
//     INSERT INTO rast_test (name, email, sets)
//     VALUES ($1, $2, $3)
//     RETURNING *;
//   `;

//   const values = [name, email, JSON.stringify(sets)];

//   const result = await pool.query(query, values);
//   return result.rows[0];
// };

// exports.getUserById = async (userId) => {
//   const query = 'SELECT * FROM rast_test WHERE id = $1';
//   const result = await pool.query(query, [userId]);
//   return result.rows[0];
// };


const pool = require('../../database/db');

exports.createUser = async (userData) => {
  const { name, email, sets } = userData;
 
  const timestamp = new Date().toISOString();

  const query = `
    INSERT INTO rast_test (name, email, sets, created_at)
    VALUES ($1, $2, $3, $4)
    RETURNING *, $4 AS timestamp;
  `;

  const values = [name, email, JSON.stringify(sets), timestamp];

  const result = await pool.query(query, values);

  // Returning with separate timestamp key in JSON response
  const user = result.rows[0];
  user.timestamp = timestamp;

  return user;
};

exports.getUserById = async (userId) => {
  const query = 'SELECT *, created_at AS timestamp FROM rast_test WHERE id = $1';
  const result = await pool.query(query, [userId]);
  if (!result.rows[0]) return null;
  const user = result.rows[0];
  user.timestamp = user.timestamp; // alias created_at as timestamp
  return user;
};

// exports.getUserByEmail = async (email) => {
//   const query = 'SELECT *, created_at AS timestamp FROM rast_test WHERE email = $1';
//   const result = await pool.query(query, [email]);
//   if (!result.rows[0]) return null;
//   const user = result.rows[0];
//   user.timestamp = user.timestamp;
//   return user;
// };

exports.getUserByEmail = async (email) => {
  const query = 'SELECT *, created_at AS timestamp FROM rast_test WHERE email = $1';
  const result = await pool.query(query, [email]);
  if (result.rows.length === 0) return null;
  return result.rows; // return all matching users as an array
};


exports.updateUser = async (userId, updateData) => {
  // Build dynamic query for update
  const fields = [];
  const values = [];
  let idx = 1;

  for (const key in updateData) {
    if (key === 'sets') {
      values.push(JSON.stringify(updateData[key]));
    } else {
      values.push(updateData[key]);
    }
    fields.push(`${key} = $${idx}`);
    idx++;
  }

  if (fields.length === 0) return null; // nothing to update

  const query = `
    UPDATE rast_test SET ${fields.join(', ')}
    WHERE id = $${idx}
    RETURNING *, created_at AS timestamp;
  `;

  values.push(userId);

  const result = await pool.query(query, values);
  if (!result.rows[0]) return null;
  const user = result.rows[0];
  user.timestamp = user.timestamp;
  return user;
};

exports.deleteUser = async (userId) => {
  const query = 'DELETE FROM rast_test WHERE id = $1 RETURNING *;';
  const result = await pool.query(query, [userId]);
  return !!result.rows[0];
};
