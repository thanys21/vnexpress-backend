const express = require("express");
const router = express.Router();
const Post = require("../models/post");

// GET /api/posts - Lấy danh sách bài viết
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("author");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/posts - Tạo bài viết mới
router.post("/", async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/posts/:id - Sửa bài viết
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/posts/:id - Xoá bài viết
router.delete("/:id", async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
