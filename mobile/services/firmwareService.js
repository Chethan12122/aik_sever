// firmware/services/firmware.service.js
const pool = require('../../database/db');

// Get latest firmware
const getLatestFirmware = async () => {
  const result = await pool.query(`
    SELECT version, file_path AS url, changelog, file_size, uploaded_at
    FROM firmware_releases
    WHERE is_latest = TRUE
    LIMIT 1
  `);
  return result.rows;
};

// Get all firmware versions
const getAllFirmware = async () => {
  const result = await pool.query(`
    SELECT id, version, file_path AS url, changelog, file_size, is_latest, uploaded_at
    FROM firmware_releases
    ORDER BY uploaded_at DESC
  `);
  return result.rows;
};

// Get firmware by version
const getFirmwareByVersion = async (version) => {
  const query = 'SELECT * FROM firmware_releases WHERE version = $1;';
  const result = await pool.query(query, [version]);
  return result.rows;
};

// Insert new firmware and mark as latest
const createFirmware = async (data) => {
  const { version, filename, file_path, file_size, changelog } = data;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Set all existing to not latest
    await client.query('UPDATE firmware_releases SET is_latest = FALSE');

    // Insert new as latest
    const result = await client.query(
      `INSERT INTO firmware_releases (version, filename, file_path, file_size, changelog, is_latest)
       VALUES ($1, $2, $3, $4, $5, TRUE)
       RETURNING *;`,
      [version, filename, file_path, file_size, changelog || '']
    );

    await client.query('COMMIT');
    return result.rows;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

// Rollback to a specific version
const rollbackToVersion = async (version) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('UPDATE firmware_releases SET is_latest = FALSE');
    const result = await client.query(
      'UPDATE firmware_releases SET is_latest = TRUE WHERE version = $1 RETURNING *;',
      [version]
    );
    await client.query('COMMIT');
    return result.rows;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

// Delete firmware by version
const deleteFirmwareByVersion = async (version) => {
  const query = 'DELETE FROM firmware_releases WHERE version = $1 RETURNING *;';
  const result = await pool.query(query, [version]);
  return result.rows;
};

module.exports = {
  getLatestFirmware,
  getAllFirmware,
  getFirmwareByVersion,
  createFirmware,
  rollbackToVersion,
  deleteFirmwareByVersion,
};