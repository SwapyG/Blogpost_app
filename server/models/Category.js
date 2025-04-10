const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
      maxlength: [50, "Category name cannot be more than 50 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    image: {
      type: String,
      default: "",
    },
    color: {
      type: String,
      default: "#3498db",
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for posts in this category
CategorySchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "categories",
  justOne: false,
});

// Generate slug from name
CategorySchema.pre("save", function (next) {
  if (!this.isModified("name")) return next();

  this.slug = this.name
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "-");

  next();
});

module.exports = mongoose.model("Category", CategorySchema);
