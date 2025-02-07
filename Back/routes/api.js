const express = require("express");
const authController = require("../controllers/auth");
const { getAllUsers, getUserById, createUser, updateUser, deleteUser } = require("../controllers/users");
const authMiddleware = require("../middlewares/auth");
const checkPermission = require("../middlewares/rbac");

const router = express.Router();

// Auth Routes
router.post("/login", authController.login);

// User CRUD routes
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// Protected Routes
router.get(
  "/stock",
  authMiddleware,
  checkPermission("view_stock"),
  (req, res) => {
    res.json({ message: "Stock data" });
  }
);

module.exports = router;
