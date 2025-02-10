const express = require("express");
const authController = require("../controllers/auth");
const { getAllRoles } = require("../controllers/roles");

const router = express.Router();

// Auth Routes
router.post("/login", authController.login);

// User Routes
const userRoutes = require("./user");
router.use("/users", userRoutes);

// Article Routes
const articleRoutes = require("./articles");
router.use("/articles", articleRoutes); // Correction ici (remplace `app.use` par `router.use`)

// Roles Routes
router.get("/roles", getAllRoles);

module.exports = router;
