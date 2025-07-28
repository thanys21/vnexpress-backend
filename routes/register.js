const express = require("express");
const router = express.Router();
const User = require("../models/user");

// POST /api/auth/register - Đăng ký tài khoản mới
router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Tên, email và password là bắt buộc",
        success: false,
      });
    }

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "Email đã được sử dụng",
        success: false,
      });
    }

    // Tạo user mới
    const newUser = new User({
      name,
      email,
      password, // Trong production, nên hash password với bcrypt
    });

    const savedUser = await newUser.save();

    res.status(201).json({
      success: true,
      message: "Đăng ký thành công",
      user: {
        id: savedUser._id,
        email: savedUser.email,
        name: savedUser.name,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      message: "Lỗi server",
      success: false,
    });
  }
});

module.exports = router;
