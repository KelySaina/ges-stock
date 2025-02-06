const express = require("express");
const authController = require("../controllers/auth");
const authMiddleware = require("../middlewares/auth");
const checkPermission = require("../middlewares/rbac");

const router = express.Router();

// Auth Routes
router.post("/login", authController.login);

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
