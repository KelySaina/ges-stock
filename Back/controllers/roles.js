const pool = require("../config/db");

// Get all users
const getAllRoles = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM roles");
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllRoles,
};
