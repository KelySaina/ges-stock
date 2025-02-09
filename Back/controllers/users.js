const pool = require("../config/db");

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users");
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new user
const createUser = async (req, res) => {
  const { name, email, password, roleId } = req.body;
  const connection = await pool.getConnection(); // Get connection for transaction

  try {
    await connection.beginTransaction(); // Start transaction

    // Insert user into users table
    const [userResult] = await connection.query(
      "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
      [name, email, password]
    );

    const userId = userResult.insertId; // Get the newly created userId

    // Insert user role into user_roles table
    await connection.query(
      "INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)",
      [userId, roleId]
    );

    await connection.commit(); // Commit transaction

    res.status(201).json({ message: "User created", userId });
  } catch (err) {
    await connection.rollback(); // Rollback transaction on error
    res.status(500).json({ error: err.message });
  } finally {
    connection.release(); // Release connection
  }
};

// Update a user
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  try {
    const [result] = await pool.query(
      "UPDATE users SET username = ?, email = ?, password_hash = ? WHERE id = ?",
      [name, email, password, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
