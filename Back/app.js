const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const apiRoutes = require("./routes/api");

dotenv.config();

const app = express();
const PORT = process.env.PORT;

if (!PORT) {
  console.error("PORT is not defined in the .env file.");
  process.exit(1);
}

// Middleware
app.use(cors({ origin: "*" })); // Adjust this in production
app.use(express.json());

// Routes
app.use("/api", apiRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
