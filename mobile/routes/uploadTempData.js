const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const pool = require('../../database/db');
const fs = require('fs');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload-temp-data', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).send('XLSX file is required');

  const filePath = req.file.path;

  try {
    // Read XLSX
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // ❗ Clear previous data
      await client.query('DELETE FROM temp_xlsx_data');

      // ❗ Insert new rows
      const insertPromises = rows.map(row =>
        client.query(
          `INSERT INTO temp_xlsx_data(email, external_id, first_name, last_name)
           VALUES ($1, $2, $3, $4)`,
          [
            row.Email || null,
            row['External-id'] || null,
            row['First Name'] || null,
            row['Last Name'] || null
          ]
        )
      );

      await Promise.all(insertPromises);

      await client.query('COMMIT');

      res.send('Temp data loaded successfully');
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(err);
      res.status(500).send('Database error while inserting');
    } finally {
      client.release();
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
  } catch (err) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    console.error(err);
    res.status(500).send('Error processing XLSX file');
  }
});

module.exports = router;
