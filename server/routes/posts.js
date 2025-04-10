const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const Post = require("../models/Post");
const { protect, authorize } = require("../middleware/auth");

// @route   GET api/posts
// @desc    Get all published posts
// @access  Public
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const search = req.query.search || "";
    const category = req.query.category || "";
    const tag = req.query.tag || "";
    const author = req.query.author || "";
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

    // Build query
    const query = { status: "published" };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { excerpt: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query.categories = category;
    }

    if (tag) {
      query.tags = tag;
    }

    if (author) {
      query.author = author;
    }

    // Setup sorting
    const sort = {};
    sort[sortBy] = sortOrder;

    // Execute query with pagination
    const total = await Post.countDocuments(query);

    const posts = await Post.find(query)
      .sort(sort)
      .skip(startIndex)
      .limit(limit)
      .populate("author", "name avatar")
      .populate("categories", "name slug")
      .populate("tags", "name slug");

    // Pagination result
    const pagination = {
      total,
      pages: Math.ceil(total / limit),
      page,
      limit,
    };

    res.status(200).json({
      success: true,
      count: posts.length,
      pagination,
      data: posts,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   GET api/posts/:id
// @desc    Get post by ID
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name avatar bio socialLinks")
      .populate("categories", "name slug")
      .populate("tags", "name slug")
      .populate({
        path: "comments",
        match: { approved: true, parent: null },
        options: { sort: { createdAt: -1 } },
        populate: [
          { path: "author", select: "name avatar" },
          {
            path: "replies",
            match: { approved: true },
            options: { sort: { createdAt: 1 } },
            populate: { path: "author", select: "name avatar" },
          },
        ],
      });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Increment view count
    if (post.status === "published") {
      post.viewCount += 1;
      await post.save();
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   GET api/posts/slug/:slug
// @desc    Get post by slug
// @access  Public
router.get("/slug/:slug", async (req, res) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug })
      .populate("author", "name avatar bio socialLinks")
      .populate("categories", "name slug")
      .populate("tags", "name slug")
      .populate({
        path: "comments",
        match: { approved: true, parent: null },
        options: { sort: { createdAt: -1 } },
        populate: [
          { path: "author", select: "name avatar" },
          {
            path: "replies",
            match: { approved: true },
            options: { sort: { createdAt: 1 } },
            populate: { path: "author", select: "name avatar" },
          },
        ],
      });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Increment view count
    if (post.status === "published") {
      post.viewCount += 1;
      await post.save();
    }

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post(
  "/",
  [
    protect,
    [
      check("title", "Title is required").not().isEmpty(),
      check("content", "Content is required").not().isEmpty(),
      check("excerpt", "Excerpt is required").not().isEmpty(),
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
      const {
        title,
        content,
        excerpt,
        coverImage,
        categories,
        tags,
        status,
        featured,
        scheduledFor,
        seo,
      } = req.body;

      // Create new post
      const newPost = new Post({
        title,
        content,
        excerpt,
        coverImage: coverImage || undefined,
        author: req.user._id,
        categories: categories || [],
        tags: tags || [],
        status: status || "draft",
        featured: featured || false,
        scheduledFor: scheduledFor || null,
        seo: seo || {},
      });

      // Save post
      const post = await newPost.save();

      res.status(201).json({
        success: true,
        data: post,
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

// @route   PUT api/posts/:id
// @desc    Update a post
// @access  Private
router.put(
  "/:id",
  [
    protect,
    [
      check("title", "Title is required").not().isEmpty(),
      check("content", "Content is required").not().isEmpty(),
      check("excerpt", "Excerpt is required").not().isEmpty(),
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
      let post = await Post.findById(req.params.id);

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }

      // Check if user is post author or admin
      if (
        post.author.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to update this post",
        });
      }

      const {
        title,
        content,
        excerpt,
        coverImage,
        categories,
        tags,
        status,
        featured,
        scheduledFor,
        seo,
      } = req.body;

      // Update post fields
      post.title = title;
      post.content = content;
      post.excerpt = excerpt;
      if (coverImage) post.coverImage = coverImage;
      if (categories) post.categories = categories;
      if (tags) post.tags = tags;
      if (status) post.status = status;
      if (featured !== undefined) post.featured = featured;
      if (scheduledFor) post.scheduledFor = scheduledFor;
      if (seo) post.seo = seo;

      // Save updated post
      await post.save();

      res.status(200).json({
        success: true,
        data: post,
      });
    } catch (err) {
      console.error(err.message);

      if (err.kind === "ObjectId") {
        return res.status(404).json({
          success: false,
          message: "Post not found",
        });
      }

      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
);

// @route   DELETE api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete("/:id", protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check if user is post author or admin
    if (
      post.author.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this post",
      });
    }

    await post.remove();

    res.status(200).json({
      success: true,
      message: "Post removed",
    });
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   GET api/posts/user/:userId
// @desc    Get all posts by user
// @access  Public
router.get("/user/:userId", async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const query = {
      author: req.params.userId,
      status: "published",
    };

    // Execute query with pagination
    const total = await Post.countDocuments(query);

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .populate("author", "name avatar")
      .populate("categories", "name slug")
      .populate("tags", "name slug");

    // Pagination result
    const pagination = {
      total,
      pages: Math.ceil(total / limit),
      page,
      limit,
    };

    res.status(200).json({
      success: true,
      count: posts.length,
      pagination,
      data: posts,
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

// @route   GET api/posts/dashboard
// @desc    Get all posts for user dashboard (including drafts)
// @access  Private
router.get("/dashboard/myposts", protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const status = req.query.status || "";

    // Build query
    const query = { author: req.user._id };

    if (status) {
      query.status = status;
    }

    // Execute query with pagination
    const total = await Post.countDocuments(query);

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .populate("categories", "name slug")
      .populate("tags", "name slug");

    // Pagination result
    const pagination = {
      total,
      pages: Math.ceil(total / limit),
      page,
      limit,
    };

    res.status(200).json({
      success: true,
      count: posts.length,
      pagination,
      data: posts,
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
