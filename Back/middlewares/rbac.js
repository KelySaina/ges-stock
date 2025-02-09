const pool = require("../config/db");
const checkPermission = (permissions) => {
  return async (req, res, next) => {
    try {
      const [rows] = await pool.query(
        `SELECT p.name FROM role_permissions rp
         JOIN permissions p ON rp.permission_id = p.id
         WHERE rp.role_id IN (?)`,
        [req.user.roles]
      );

      const userPermissions = rows.map((row) => row.name);

      // Vérification selon le mode choisi
      const hasPermission = permissions.every((perm) =>
        userPermissions.includes(perm)
      ); // Doit avoir **au moins une** permission

      if (!hasPermission) {
        return res.status(403).json({ error: "Forbidden" });
      }

      next();
    } catch (error) {
      console.error("Permission check error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
};

module.exports = checkPermission;
