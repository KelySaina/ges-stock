const express = require("express");
const authController = require("../controllers/auth");
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");
const { getAllRoles } = require("../controllers/roles");
const authMiddleware = require("../middlewares/auth");
const checkPermission = require("../middlewares/rbac");

const router = express.Router();

// Auth Routes
router.post("/login", authController.login);

// User CRUD routes
router.get(
  "/users",
  authMiddleware,
  checkPermission(["manage_users", "view_history"]),
  getAllUsers
);
router.get(
  "/users/:id",
  authMiddleware,
  checkPermission(["manage_users", "view_history"]),
  getUserById
);
router.post(
  "/users",
  authMiddleware,
  checkPermission(["manage_users", "view_history"]),
  createUser
);
router.put(
  "/users/:id",
  authMiddleware,
  checkPermission(["manage_users", "view_history"]),
  updateUser
);
router.delete(
  "/users/:id",
  authMiddleware,
  checkPermission(["manage_users", "view_history"]),
  deleteUser
);

// Roles routes
router.get("/roles", getAllRoles);

// Protected Routes
// router.get(
//   "/stock",
//   authMiddleware,
//   checkPermission("view_stock"),
//   (req, res) => {
//     res.json({ message: "Stock data" });
//   }
// );

module.exports = router;
