const pool = require("../config/db");
const bcrypt = require("bcryptjs");

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT 
          users.username, 
          users.id, 
          users.email, 
          roles.name AS role_name
      FROM users
      JOIN user_roles ON users.id = user_roles.user_id
      JOIN roles ON roles.id = user_roles.role_id;
      `
    );
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT 
          users.username, 
          users.id, 
          users.email, 
          roles.id AS role_id
      FROM users
      JOIN user_roles ON users.id = user_roles.user_id
      JOIN roles ON roles.id = user_roles.role_id WHERE users.id = ?`,
      [id]
    );
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
  const { username, password, email, roleId } = req.body;
  const connection = await pool.getConnection(); // Get connection for transaction

  try {
    await connection.beginTransaction(); // Start transaction

    // Check if the username or email already exists
    const [existingUser] = await connection.query(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, email]
    );

    if (existingUser.length > 0) {
      await connection.release();
      return res
        .status(409)
        .json({ error: "Username or email already exists." });
    }

    // Hash the password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Insert the new user into the database
    const [userResult] = await connection.query(
      "INSERT INTO users (username, password_hash, email) VALUES (?, ?, ?)",
      [username, hashedPassword, email]
    );

    const userId = userResult.insertId; // Get the new user ID

    // Insert user role into user_role table
    await connection.query(
      "INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)",
      [userId, roleId]
    );

    await connection.commit(); // Commit transaction

    res.status(201).json({
      message: "User created successfully.",
      userId,
    });
  } catch (err) {
    await connection.rollback(); // Rollback on error
    res.status(500).json({ error: "Internal server error: " + err.message });
  } finally {
    connection.release(); // Release connection
  }
};

// Update a user
const updateUser = async (req, res) => {
  const { id } = req.params; // Get user ID from the route parameter
  const { username, password, email, role_id } = req.body;

  // Validate input
  if (!username && !password && !email) {
    return res
      .status(400)
      .json({ error: "At least one field must be provided for update." });
  }

  try {
    // Fetch the existing user to check if they exist
    const [existingUser] = await pool.query(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );

    if (existingUser.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    // Prepare fields to update
    const fieldsToUpdate = [];
    const values = [];

    if (username) {
      fieldsToUpdate.push("username = ?");
      values.push(username);
    }
    if (email) {
      fieldsToUpdate.push("email = ?");
      values.push(email);
    }
    if (password) {
      // Hash the new password before updating
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync(password, salt);
      fieldsToUpdate.push("password_hash = ?");
      values.push(hashedPassword);
    }

    // Add the user ID to the values array for the WHERE clause
    values.push(id);

    // Build the update query dynamically
    const query = `UPDATE users SET ${fieldsToUpdate.join(", ")} WHERE id = ?`;

    // Execute the query
    await pool.query(query, values);

    // Build the update query for role
    const queryRole = `UPDATE user_roles SET role_id = ? WHERE user_id = ?`;

    // Execute the query
    await pool.query(queryRole, [role_id, id]);

    res.status(200).json({ message: "User updated successfully." });
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ error: "Internal server error." });
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
