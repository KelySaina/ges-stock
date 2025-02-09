const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../config/db");

const login = async (req, res) => {
  const { username, password } = req.body;
  const [rows] = await db.query(
    `SELECT 
          users.username, 
          users.id, 
          users.email, 
          users.password_hash,
          roles.id AS role_id
      FROM users
      JOIN user_roles ON users.id = user_roles.user_id
      JOIN roles ON roles.id = user_roles.role_id WHERE users.username = ?`,
    [username]
  );
  const user = rows[0];

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { userId: user.id, roles: user.role_id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ success: true, token, role: user.role_id });
};

module.exports = { login };
