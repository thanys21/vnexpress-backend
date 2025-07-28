const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Import routes
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

module.exports = app;
