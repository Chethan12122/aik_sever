const pool = require('../database/db');

exports.findByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
};

exports.findByEmailOrUID = async (email, uid) => {
    const result = await pool.query(
        'SELECT * FROM users WHERE email = $1 OR firebase_uid = $2',
        [email, uid]
    );
    return result.rows[0];
};

exports.createUser = async (email, name, firebase_uid, passwordHash = null) => {
    const result = await pool.query(
        `INSERT INTO users (email, name, firebase_uid, password)
         VALUES ($1, $2, $3, $4) RETURNING id`,
        [email, name, firebase_uid, passwordHash]
    );
    return result.rows[0];
};
