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
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email và password là bắt buộc",
        success: false,
      });
    }

    // Try to find user in database first
    let user = await User.findOne({ email });

    // If not found in database, check mock users
    if (!user) {
      const mockUser = MOCK_USERS.find(
        (u) => u.email === email && u.password === password
      );

      if (mockUser) {
        user = mockUser;
      }
    } else {
      // For database users, check password
      if (user.password !== password) {
        return res.status(401).json({
          message: "Email hoặc mật khẩu không đúng",
          success: false,
        });
      }
    }

    if (!user) {
      return res.status(401).json({
        message: "Email hoặc mật khẩu không đúng",
        success: false,
      });
    }

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
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

module.exports = router;
