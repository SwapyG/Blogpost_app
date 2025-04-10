const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const { protect, authorize } = require("../middleware/auth");

// @route   GET api/users/profile/:id
// @desc    Get user profile by ID
// @access  Public
router.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -resetPasswordToken -resetPasswordExpire -emailVerificationToken -emailVerificationExpire"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   PUT api/users/profile
// @desc    Update current user profile
// @access  Private
router.put(
  "/profile",
  [
    protect,
    [
      check("name", "Name is required").not().isEmpty(),
      check("bio", "Bio cannot exceed 500 characters").isLength({ max: 500 }),
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
      const { name, bio, avatar, socialLinks } = req.body;

      // Get user
      const user = await User.findById(req.user._id);

      // Update fields
      user.name = name;
      if (bio !== undefined) user.bio = bio;
      if (avatar) user.avatar = avatar;
      if (socialLinks) {
        user.socialLinks = {
          ...user.socialLinks,
          ...socialLinks,
        };
      }

      // Save updated user
      await user.save();

      // Return user without sensitive fields
      const updatedUser = await User.findById(req.user._id).select(
        "-password -resetPasswordToken -resetPasswordExpire -emailVerificationToken -emailVerificationExpire"
      );

      res.status(200).json({
        success: true,
        data: updatedUser,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

// @route   PUT api/users/change-password
// @desc    Change user password
// @access  Private
router.put(
  "/change-password",
  [
    protect,
    [
      check("currentPassword", "Current password is required").not().isEmpty(),
      check(
        "newPassword",
        "New password must be at least 6 characters"
      ).isLength({ min: 6 }),
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
      const { currentPassword, newPassword } = req.body;

      // Get user
      const user = await User.findById(req.user._id);

      // Check current password
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      // Update password
      user.password = newPassword;

      // Save updated user
      await user.save();

      res.status(200).json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

// @route   GET api/users
// @desc    Get all users (admin only)
// @access  Private (Admin only)
router.get("/", [protect, authorize("admin")], async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const search = req.query.search || "";
    const role = req.query.role || "";

    // Build query
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role) {
      query.role = role;
    }

    // Execute query with pagination
    const total = await User.countDocuments(query);

    const users = await User.find(query)
      .select(
        "-password -resetPasswordToken -resetPasswordExpire -emailVerificationToken -emailVerificationExpire"
      )
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    // Pagination result
    const pagination = {
      total,
      pages: Math.ceil(total / limit),
      page,
      limit,
    };

    res.status(200).json({
      success: true,
      count: users.length,
      pagination,
      data: users,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   PUT api/users/:id/role
// @desc    Update user role (admin only)
// @access  Private (Admin only)
router.put(
  "/:id/role",
  [
    protect,
    authorize("admin"),
    [check("role", "Role is required").isIn(["user", "editor", "admin"])],
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
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Update role
      user.role = req.body.role;

      // Save updated user
      await user.save();

      res.status(200).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      console.error(err.message);

      if (err.kind === "ObjectId") {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

module.exports = router;
