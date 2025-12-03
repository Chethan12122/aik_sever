const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const xlsx = require('xlsx');
const fs = require('fs');
const pool = require('../../database/db');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// ---------------------------
// Parse date function
// ---------------------------
function parseDate(dateStr) {
  if (!dateStr) return null;

  // If it's already a Date object, return it directly
  if (dateStr instanceof Date) {
    if (!isNaN(dateStr)) return dateStr;
    else return null; // Invalid date object
  }

  // Convert non-string input (like numbers) to string safely
  if (typeof dateStr !== 'string') {
    dateStr = dateStr.toString();
  }

  let parts;
  if (dateStr.includes('-')) parts = dateStr.split('-');
  else if (dateStr.includes('/')) parts = dateStr.split('/');
  else return null;

  if (parts.length !== 3) return null;

  // Assuming day-month-year format: parts = [day, month, year]
  const year = parts[2].padStart(4, '0');
  const month = parts[1].padStart(2, '0');
  const day = parts[0].padStart(2, '0');

  return new Date(`${year}-${month}-${day}`);
}


// ---------------------------
// UPSERT inside transaction
// ---------------------------
async function insertOrUpdateUserDetail(data) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const userResult = await client.query(
      `INSERT INTO users (email, name, password, firebase_uid, verified_at)
       VALUES ($1, $2, NULL, NULL, CURRENT_TIMESTAMP)
       ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      [data.email, data.name]
    );

    const detailResult = await client.query(
      `INSERT INTO details (email, role, name, gender, date_of_birth, weight, height, primary_sport)
       VALUES ($1, 'athlete', $2, $3, $4, $5, $6, $7)
       ON CONFLICT (email) DO UPDATE SET
          name = EXCLUDED.name,
          gender = EXCLUDED.gender,
          date_of_birth = EXCLUDED.date_of_birth,
          weight = EXCLUDED.weight,
          height = EXCLUDED.height,
          primary_sport = EXCLUDED.primary_sport
       RETURNING id`,
      [
        data.email,
        data.name,
        data.gender,
        data.date_of_birth,
        data.weight,
        data.height,
        data.primary_sport
      ]
    );

    await client.query("COMMIT");
    return detailResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

// ---------------------------
// Route → /upload-users
// ---------------------------
router.post('/upload-users', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).send("CSV or Excel file is required");

  const filePath = req.file.path;
  const results = [];

  const processRow = async (row) => {
    const name = `${row['First Name']} ${row['Last Name']}`.trim();
    const email =
      row['Email'] ||
      (row['External-id'] ? `${row['External-id']}@gmail.com` : 'rollnumber@gmail.com');

    const date_of_birth = parseDate(row['Date-of-Birth']) || new Date("2000-01-01");
    const weight = row['Weight'] ? parseFloat(row['Weight']) : null;
    const height = row['Height'] ? parseFloat(row['Height']) : null;
    const primary_sport = row['Sport'] || "Basketball";
    const gender = row['Sex'] || "Male";

    return insertOrUpdateUserDetail({
      name,
      email,
      date_of_birth,
      weight,
      height,
      primary_sport,
      gender
    });
  };

  // -------- CSV file ----------
  if (req.file.mimetype === 'text/csv') {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        results.push(processRow(row));
      })
      .on("end", async () => {
        try {
          await Promise.all(results);
          fs.unlinkSync(filePath);
          res.send("CSV processed successfully");
        } catch (error) {
          console.error(error);
          res.status(500).send("Error processing CSV");
        }
      });
  }

  // -------- Excel file ----------
  else if (
    req.file.mimetype === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
    req.file.mimetype === "application/vnd.ms-excel"
  ) {
    try {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const rows = xlsx.utils.sheet_to_json(sheet);
      const promises = rows.map(processRow);

      await Promise.all(promises);
      fs.unlinkSync(filePath);

      res.send("Excel processed successfully");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error processing Excel");
    }
  }

  // -------- Unsupported file ----------
  else {
    fs.unlinkSync(filePath);
    return res.status(400).send("Unsupported file format");
  }
});

module.exports = router;
