const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Tag = require("../models/Tag");
const { protect, authorize } = require("../middleware/auth");

// @route   GET api/tags
// @desc    Get all tags
// @access  Public
router.get("/", async (req, res) => {
  try {
    const tags = await Tag.find().sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: tags.length,
      data: tags,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   GET api/tags/:id
// @desc    Get tag by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }

    res.status(200).json({
      success: true,
      data: tag,
    });
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   GET api/tags/slug/:slug
// @desc    Get tag by slug
// @access  Public
router.get("/slug/:slug", async (req, res) => {
  try {
    const tag = await Tag.findOne({ slug: req.params.slug });

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }

    res.status(200).json({
      success: true,
      data: tag,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   POST api/tags
// @desc    Create a tag
// @access  Private (Admin or Editor)
router.post(
  "/",
  [
    protect,
    authorize("admin", "editor"),
    [
      check("name", "Tag name is required").not().isEmpty(),
      check("name", "Tag name cannot exceed 30 characters").isLength({
        max: 30,
      }),
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
      const { name, description } = req.body;

      // Check if tag already exists
      let tag = await Tag.findOne({ name });
      if (tag) {
        return res.status(400).json({
          success: false,
          message: "Tag already exists",
        });
      }

      // Create new tag
      tag = new Tag({
        name,
        description,
      });

      // Save tag
      await tag.save();

      res.status(201).json({
        success: true,
        data: tag,
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

// @route   PUT api/tags/:id
// @desc    Update a tag
// @access  Private (Admin or Editor)
router.put(
  "/:id",
  [
    protect,
    authorize("admin", "editor"),
    [
      check("name", "Tag name is required").not().isEmpty(),
      check("name", "Tag name cannot exceed 30 characters").isLength({
        max: 30,
      }),
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
      const { name, description } = req.body;

      // Check if tag exists
      let tag = await Tag.findById(req.params.id);
      if (!tag) {
        return res.status(404).json({
          success: false,
          message: "Tag not found",
        });
      }

      // Check if updated name already exists
      if (name !== tag.name) {
        const existingTag = await Tag.findOne({ name });
        if (existingTag) {
          return res.status(400).json({
            success: false,
            message: "Tag name already exists",
          });
        }
      }

      // Update tag fields
      tag.name = name;
      if (description) tag.description = description;

      // Save updated tag
      await tag.save();

      res.status(200).json({
        success: true,
        data: tag,
      });
    } catch (err) {
      console.error(err.message);

      if (err.kind === "ObjectId") {
        return res.status(404).json({
          success: false,
          message: "Tag not found",
        });
      }

      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

// @route   DELETE api/tags/:id
// @desc    Delete a tag
// @access  Private (Admin only)
router.delete("/:id", [protect, authorize("admin")], async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);

    if (!tag) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }

    await tag.remove();

    res.status(200).json({
      success: true,
      message: "Tag removed",
    });
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   GET api/tags/popular
// @desc    Get popular tags
// @access  Public
router.get("/popular/list", async (req, res) => {
  try {
    // You would typically implement a count of posts per tag
    // This is a simplified version
    const tags = await Tag.find().sort({ name: 1 }).limit(10);

    res.status(200).json({
      success: true,
      count: tags.length,
      data: tags,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router;
