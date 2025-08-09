const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:3001", 
        "http://localhost:5173",
        "https://vnexpress-chi.vercel.app",
        "https://vnexpress.vercel.app",
        "https://localhost:3000"
      ];
      
      // In development or if NODE_ENV is not set, allow all origins
      if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
        return callback(null, true);
      }
      
      // Check if origin is in allowed list
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      // For production, be more strict but log the rejected origin
      console.log("CORS rejected origin:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: [
      "Content-Type", 
      "Authorization", 
      "X-Requested-With",
      "Accept",
      "Origin"
    ],
    exposedHeaders: ["Authorization"],
    preflightContinue: false
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Handle preflight requests explicitly
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin || "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS,PATCH");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization,X-Requested-With,Accept,Origin");
  res.header("Access-Control-Allow-Credentials", "true");
  res.status(200).end();
});

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "VnExpress Backend API",
    status: "running",
    endpoints: {
      auth: "/api/auth/login",
      users: "/api/users",
      posts: "/api/posts",
    },
  });
});

// Health check
app.get("/api", (req, res) => {
  res.json({
    message: "VnExpress API is running",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// Kết nối MongoDB
if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => {
      console.error("❌ MongoDB connection error:", err);
      console.log("⚠️ Running without MongoDB - using mock data only");
    });
} else {
  console.log("⚠️ No MONGODB_URI found - running without database");
  console.log("🔧 Create .env file with MONGODB_URI to enable database features");
}

// Import routes
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/post");
const authRoutes = require("./routes/auth");
const registerRoutes = require("./routes/register");

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/auth", registerRoutes);

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    message: "Route not found",
    success: false,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global error:", err);
  res.status(500).json({
    message: "Internal server error",
    success: false,
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

module.exports = app;
