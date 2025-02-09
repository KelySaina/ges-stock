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
router.get("/users", authMiddleware, getAllUsers);
router.get("/users/:id", authMiddleware, getUserById);
router.post("/users", authMiddleware, createUser);
router.put("/users/:id", authMiddleware, updateUser);
router.delete("/users/:id", authMiddleware, deleteUser);

// Roles routes
router.get("/roles", authMiddleware, getAllRoles);

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
