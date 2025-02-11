const express = require("express");
const router = express.Router();
const {
  transationArticle,
  checkStock,
} = require("../controllers/transactions");
const authMiddleware = require("../middlewares/auth");
const checkPermission = require("../middlewares/rbac");

// Perform stock transactions (entry/exit)
router.post(
  "/",
  authMiddleware,
  checkPermission(["perform_transactions"]),
  transationArticle
);

// Check stock availability before removing stock
router.post(
  "/check",
  authMiddleware,
  checkPermission(["perform_transactions"]),
  checkStock
);

module.exports = router;
