const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const { protect } = require("../middleware/auth");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

// Configure upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
  fileFilter: fileFilter,
});

// @route   POST api/upload/image
// @desc    Upload image
// @access  Private
router.post("/image", protect, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "blog",
    });

    res.status(200).json({
      success: true,
      data: {
        url: result.secure_url,
        public_id: result.public_id,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// @route   DELETE api/upload/image/:publicId
// @desc    Delete image from Cloudinary
// @access  Private
router.delete("/image/:publicId", protect, async (req, res) => {
  try {
    // Extract public_id from the URL
    const publicId = req.params.publicId;

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    res.status(200).json({
      success: true,
      message: "Image deleted successfully",
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
