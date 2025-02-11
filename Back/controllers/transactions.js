const pool = require("../config/db");

// Function to add (entry) or remove (exit) stock
const transationArticle = async (req, res) => {
  const { article_id, quantity, action } = req.body;
  const user_id = req.user.userId;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Fetch current stock
    const [rows] = await connection.query(
      "SELECT quantity FROM stock_current WHERE article_id = ?",
      [article_id]
    );

    if (rows.length === 0) {
      await connection.rollback();
      return res
        .status(404)
        .json({ error: "Article not found in stock.", success: false });
    }

    let currentStock = rows[0].quantity;

    if (action === "out") {
      // Check if stock is sufficient before performing exit
      if (currentStock < quantity) {
        await connection.rollback();
        return res
          .status(400)
          .json({ error: "Not enough stock available.", success: false });
      }
      currentStock -= quantity;
    } else if (action === "in") {
      currentStock += quantity;
    } else {
      await connection.rollback();
      return res
        .status(400)
        .json({ error: "Invalid action. Use 'in' or 'out'.", success: false });
    }

    // Update stock_current table
    await connection.query(
      "UPDATE stock_current SET quantity = ?, last_updated = NOW(), last_user_updated = ? WHERE article_id = ?",
      [currentStock, user_id, article_id]
    );

    await connection.commit();
    res.status(200).json({
      message: `Stock ${action} successful`,
      newStock: currentStock,
      success: true,
    });
  } catch (err) {
    await connection.rollback();
    res
      .status(500)
      .json({ error: "Internal server error: " + err.message, success: false });
  } finally {
    connection.release();
  }
};

// Function to check if there is enough stock to perform a sortie
const checkStock = async (req, res) => {
  const { article_id, quantity, transaction_type } = req.body;
  if (transaction_type === "out") {
    try {
      const [rows] = await pool.query(
        "SELECT quantity FROM stock_current WHERE article_id = ?",
        [article_id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ error: "Article not found in stock." });
      }

      const availableStock = rows[0].quantity;

      if (availableStock < quantity) {
        return res
          .status(200)
          .json({ error: "Not enough stock available.", available: false });
      }

      res
        .status(200)
        .json({ message: "Stock is sufficient.", available: true });
    } catch (err) {
      res.status(500).json({ error: "Internal server error: " + err.message });
    }
  } else {
    res.status(200).json({ message: "Stock is sufficient.", available: true });
  }
};

module.exports = {
  transationArticle,
  checkStock,
};
