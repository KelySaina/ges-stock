const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");
const authMiddleware = require("../middlewares/auth");
const checkPermission = require("../middlewares/rbac");

// Routes pour les utilisateurs
router.get(
  "/",
  authMiddleware,
  checkPermission(["manage_users", "view_history"]), // Peut-être revoir cette combinaison
  getAllUsers
);

router.get(
  "/:id",
  authMiddleware,
  checkPermission(["view_history"]), // Voir un utilisateur = besoin de "view_history"
  getUserById
);

router.post(
  "/",
  authMiddleware,
  checkPermission(["manage_users"]), // Création = besoin de "manage_users"
  createUser
);

router.put(
  "/:id",
  authMiddleware,
  checkPermission(["manage_users"]), // Modification = besoin de "manage_users"
  updateUser
);

router.delete(
  "/:id",
  authMiddleware,
  checkPermission(["manage_users"]), // Suppression = besoin de "manage_users"
  deleteUser
);

module.exports = router;
