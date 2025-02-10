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
router.use("/articles", articleRoutes);

// Transactions Routes
const transactionsRoute = require("./transactions");
router.use("/transaction", transactionsRoute);

// Roles Routes
router.get("/roles", getAllRoles);

module.exports = router;
