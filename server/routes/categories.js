const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Category = require("../models/Category");
const { protect, authorize } = require("../middleware/auth");

// @route   GET api/categories
// @desc    Get all categories
// @access  Public
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   GET api/categories/:id
// @desc    Get category by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   GET api/categories/slug/:slug
// @desc    Get category by slug
// @access  Public
router.get("/slug/:slug", async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   POST api/categories
// @desc    Create a category
// @access  Private (Admin only)
router.post(
  "/",
  [
    protect,
    authorize("admin"),
    [
      check("name", "Category name is required").not().isEmpty(),
      check("name", "Category name cannot exceed 50 characters").isLength({
        max: 50,
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
      const { name, description, image, color, featured } = req.body;

      // Check if category already exists
      let category = await Category.findOne({ name });
      if (category) {
        return res.status(400).json({
          success: false,
          message: "Category already exists",
        });
      }

      // Create new category
      category = new Category({
        name,
        description,
        image,
        color,
        featured,
      });

      // Save category
      await category.save();

      res.status(201).json({
        success: true,
        data: category,
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

// @route   PUT api/categories/:id
// @desc    Update a category
// @access  Private (Admin only)
router.put(
  "/:id",
  [
    protect,
    authorize("admin"),
    [
      check("name", "Category name is required").not().isEmpty(),
      check("name", "Category name cannot exceed 50 characters").isLength({
        max: 50,
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
      const { name, description, image, color, featured } = req.body;

      // Check if category exists
      let category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      // Check if updated name already exists
      if (name !== category.name) {
        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
          return res.status(400).json({
            success: false,
            message: "Category name already exists",
          });
        }
      }

      // Update category fields
      category.name = name;
      if (description) category.description = description;
      if (image) category.image = image;
      if (color) category.color = color;
      if (featured !== undefined) category.featured = featured;

      // Save updated category
      await category.save();

      res.status(200).json({
        success: true,
        data: category,
      });
    } catch (err) {
      console.error(err.message);

      if (err.kind === "ObjectId") {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }

      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

// @route   DELETE api/categories/:id
// @desc    Delete a category
// @access  Private (Admin only)
router.delete("/:id", [protect, authorize("admin")], async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await category.remove();

    res.status(200).json({
      success: true,
      message: "Category removed",
    });
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   GET api/categories/featured
// @desc    Get featured categories
// @access  Public
router.get("/featured/list", async (req, res) => {
  try {
    const categories = await Category.find({ featured: true }).sort({
      name: 1,
    });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
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
