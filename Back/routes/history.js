const express = require("express");
const router = express.Router();
const { getHistory } = require("../controllers/history");
const authMiddleware = require("../middlewares/auth");
const checkPermission = require("../middlewares/rbac");

// Routes pour les utilisateurs
router.get("/", getHistory);

module.exports = router;
