const pool = require("../config/db");

const getHistory = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT
            st.quantity,
            st.old_quantity,
            st.operation,
            st.type,
            st.created_at,
            a.name AS article_name,
            a.description AS article_description,
            u.username,
            r.name AS role_name,
            sc.quantity AS sc_qty
         FROM stock_transactions AS st
         JOIN articles AS a ON st.article_id = a.id
         JOIN stock_current AS sc ON sc.article_id = a.id
         JOIN users AS u ON st.user_id = u.id
         JOIN user_roles AS ur ON u.id = ur.user_id
         JOIN roles AS r ON r.id = ur.role_id
         `
    );

    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getHistory,
};
