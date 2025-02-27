const pool = require("../config/db");

// Get all articles
const getAllArticles = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, description, created_by, created_at, soft_del FROM articles;`
    );
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get article by ID
const getArticleById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT id, name, description, created_by, created_at FROM articles WHERE id = ?`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new article
const createArticle = async (req, res) => {
  const { name, description } = req.body;
  const created_by = req.user.userId;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      "INSERT INTO articles (name, description, created_by, created_at) VALUES (?, ?, ?, NOW())",
      [name, description, created_by]
    );
    const articleId = result.insertId;

    await connection.query(
      "INSERT INTO stock_current (article_id, quantity, last_updated, last_user_updated) VALUES (?, 0, NOW(), ?)",
      [articleId, created_by]
    );

    await connection.commit();
    res
      .status(201)
      .json({ message: "Article created successfully.", articleId });
  } catch (err) {
    await connection.rollback();
    res.status(500).json({ error: "Internal server error: " + err.message });
  } finally {
    connection.release();
  }
};

// Update an article
const updateArticle = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const created_by = req.user.userId;

  if (
    name === undefined &&
    description === undefined &&
    created_by === undefined
  ) {
    return res
      .status(400)
      .json({ error: "At least one field must be provided for update." });
  }

  try {
    const fieldsToUpdate = [];
    const values = [];

    if (name !== undefined) {
      fieldsToUpdate.push("name = ?");
      values.push(name);
    }
    if (description !== undefined) {
      fieldsToUpdate.push("description = ?");
      values.push(description);
    }
    if (created_by !== undefined) {
      fieldsToUpdate.push("created_by = ?");
      values.push(created_by);
    }

    values.push(id);

    const query = `UPDATE articles SET ${fieldsToUpdate.join(
      ", "
    )} WHERE id = ?`;
    await pool.query(query, values);

    res.status(200).json({ message: "Article updated successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// Delete an article
const deleteArticle = async (req, res) => {
  const { id } = req.params;
  const created_by = req.user.userId;
  try {
    const [result] = await pool.query(
      "UPDATE articles SET soft_del = 1 WHERE id = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Article not found" });
    }

    const [result2] = await pool.query(
      "UPDATE stock_current SET quantity = -1060, last_user_updated = ? WHERE article_id = ?",
      [created_by, id]
    );
    if (result2.affectedRows === 0) {
      return res.status(404).json({ message: "Article not found" });
    }
    res.status(200).json({ message: "Article deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
};
