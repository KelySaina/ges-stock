const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env;

// Validate required environment variables
if (!DB_HOST || !DB_USER || !DB_PASS || !DB_NAME) {
  console.error("Missing database environment variables.");
  process.exit(1);S
}

const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  } else {
    console.log("Connected to MySQL database.");
    connection.release();
  }
});

module.exports = pool.promise();
