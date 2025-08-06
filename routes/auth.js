const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Mock users for testing
const MOCK_USERS = [
  {
    id: "1",
    email: "admin@vnexpress.com",
    password: "123456",
    name: "Admin VnExpress",
  },
  {
    id: "2",
    email: "user@vnexpress.com",
    password: "123456",
    name: "User VnExpress",
  },
];

// POST login
router.post("/login", async (req, res) => {
  try {
    console.log("Login request received:", req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("Missing email or password");
      return res.status(400).json({
        message: "Email và password là bắt buộc",
        success: false,
      });
    }

    console.log("Searching for user with email:", email);
    
    // Try to find user in database first
    let user = await User.findOne({ email });
    console.log("Database user found:", user ? "Yes" : "No");

    // If not found in database, check mock users
    if (!user) {
      console.log("Checking mock users");
      const mockUser = MOCK_USERS.find(
        (u) => u.email === email && u.password === password
      );

      if (mockUser) {
        console.log("Mock user found:", mockUser.email);
        user = mockUser;
      }
    } else {
      // For database users, check password
      console.log("Checking database user password");
      if (user.password !== password) {
        console.log("Password mismatch");
        return res.status(401).json({
          message: "Email hoặc mật khẩu không đúng",
          success: false,
        });
      }
    }

    if (!user) {
      console.log("No user found with provided credentials");
      return res.status(401).json({
        message: "Email hoặc mật khẩu không đúng",
        success: false,
      });
    }

    console.log("User authenticated successfully:", user.email);
    
    // Generate token
    const token = `token_${user.id || user._id}_${Date.now()}`;

    res.status(200).json({
      success: true,
      message: "Đăng nhập thành công",
      user: {
        id: user.id || user._id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    console.error("Login error details:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      message: "Lỗi server",
      success: false,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
