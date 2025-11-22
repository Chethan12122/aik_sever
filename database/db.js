const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionTimeoutMillis: 20000,
  idleTimeoutMillis: 20000,
  max: 10,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: true }
      : false,
});

pool
  .connect()
  .then(() => {
    console.log("Connected to PostgreSQL database.");
  })
  .catch((err) => {
    console.error("Error connecting to PostgreSQL database", err.stack);
  });

module.exports = pool;
