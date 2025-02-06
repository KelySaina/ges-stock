const checkPermission = (permission) => {
  return async (req, res, next) => {
    const [rows] = await req.db.query(
      `SELECT p.name FROM role_permissions rp
         JOIN permissions p ON rp.permission_id = p.id
         WHERE rp.role_id IN (?)`,
      [req.user.roles]
    );
    const userPermissions = rows.map((row) => row.name);
    if (!userPermissions.includes(permission)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    next();
  };
};

module.exports = checkPermission;
