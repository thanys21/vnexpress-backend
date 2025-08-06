const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
// CORS configuration
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "https://vnexpress-chi.vercel.app",
    ],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Import routes
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const authRoutes = require("./routes/auth");
const registerRoutes = require("./routes/register");

// Test endpoint
app.get("/api/test", (_req, res) => {
  res.json({
    message: "API đang hoạt động!",
    timestamp: new Date().toISOString(),
    cors: "enabled",
  });
});

// Test auth endpoint
app.post("/api/auth/test", (req, res) => {
  res.json({
    message: "Auth route working",
    body: req.body,
    timestamp: new Date().toISOString(),
  });
});

// Simple login endpoint for testing
app.post("/api/auth/simple-login", (req, res) => {
  const { email, password } = req.body;
  
  if (email === "admin@vnexpress.com" && password === "123456") {
    res.json({
      success: true,
      message: "Đăng nhập thành công",
      user: {
        id: "1",
        email: "admin@vnexpress.com",
        name: "Admin VnExpress",
      },
      token: `token_1_${Date.now()}`,
    });
  } else {
    res.status(401).json({
      message: "Email hoặc mật khẩu không đúng",
      success: false,
    });
  }
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/auth", registerRoutes);

module.exports = app;
