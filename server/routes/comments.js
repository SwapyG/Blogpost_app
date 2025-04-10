const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Comment = require("../models/Comment");
const Post = require("../models/Post");
const { protect, authorize } = require("../middleware/auth");

// @route   POST api/comments
// @desc    Create a comment
// @access  Private
router.post(
  "/",
  [
    protect,
    [
      check("content", "Comment content is required").not().isEmpty(),
      check("post", "Post ID is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    try {
      const { content, post, parent } = req.body;

      // Check if post exists
      const postExists = await Post.findById(post);
      if (!postExists) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }

      // Check if parent comment exists if provided
      if (parent) {
        const parentComment = await Comment.findById(parent);
        if (!parentComment) {
          return res.status(404).json({
            success: false,
            message: "Parent comment not found",
          });
        }
      }

      // Create new comment
      const newComment = new Comment({
        content,
        post,
        author: req.user._id,
        parent: parent || null,
      });

      // Save comment
      const comment = await newComment.save();

      // Populate author details
      await comment.populate("author", "name avatar").execPopulate();

      res.status(201).json({
        success: true,
        data: comment,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

// @route   GET api/comments/post/:postId
// @desc    Get all comments for a post
// @access  Public
router.get("/post/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({
      post: req.params.postId,
      parent: null,
      approved: true,
    })
      .sort({ createdAt: -1 })
      .populate("author", "name avatar")
      .populate({
        path: "replies",
        match: { approved: true },
        options: { sort: { createdAt: 1 } },
        populate: { path: "author", select: "name avatar" },
      });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   PUT api/comments/:id
// @desc    Update a comment
// @access  Private
router.put(
  "/:id",
  [protect, [check("content", "Comment content is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    try {
      const comment = await Comment.findById(req.params.id);

      if (!comment) {
        return res.status(404).json({
          success: false,
          message: "Comment not found",
        });
      }

      // Check if user is comment author
      if (
        comment.author.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to update this comment",
        });
      }

      // Update comment
      comment.content = req.body.content;

      // Save updated comment
      await comment.save();

      res.status(200).json({
        success: true,
        data: comment,
      });
    } catch (err) {
      console.error(err.message);

      if (err.kind === "ObjectId") {
        return res.status(404).json({
          success: false,
          message: "Comment not found",
        });
      }

      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

// @route   DELETE api/comments/:id
// @desc    Delete a comment
// @access  Private
router.delete("/:id", protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check if user is comment author or admin
    if (
      comment.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this comment",
      });
    }

    // Delete all replies if this is a parent comment
    if (!comment.parent) {
      await Comment.deleteMany({ parent: comment._id });
    }

    // Delete the comment
    await comment.remove();

    res.status(200).json({
      success: true,
      message: "Comment removed",
    });
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   PUT api/comments/like/:id
// @desc    Like a comment
// @access  Private
router.put("/like/:id", protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check if the comment has already been liked by this user
    if (
      comment.likes.some((like) => like.toString() === req.user._id.toString())
    ) {
      return res.status(400).json({
        success: false,
        message: "Comment already liked",
      });
    }

    // Add user id to likes array
    comment.likes.unshift(req.user._id);

    // Save comment
    await comment.save();

    res.status(200).json({
      success: true,
      data: comment.likes,
    });
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   PUT api/comments/unlike/:id
// @desc    Unlike a comment
// @access  Private
router.put("/unlike/:id", protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check if the comment has not yet been liked by this user
    if (
      !comment.likes.some((like) => like.toString() === req.user._id.toString())
    ) {
      return res.status(400).json({
        success: false,
        message: "Comment has not yet been liked",
      });
    }

    // Remove user id from likes array
    comment.likes = comment.likes.filter(
      (like) => like.toString() !== req.user._id.toString()
    );

    // Save comment
    await comment.save();

    res.status(200).json({
      success: true,
      data: comment.likes,
    });
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   PUT api/comments/approve/:id
// @desc    Approve a comment
// @access  Private (Admin only)
router.put("/approve/:id", [protect, authorize("admin")], async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Update approval status
    comment.approved = true;

    // Save comment
    await comment.save();

    res.status(200).json({
      success: true,
      data: comment,
    });
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;
