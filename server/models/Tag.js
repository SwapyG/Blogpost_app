const mongoose = require("mongoose");

const TagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tag name is required"],
      trim: true,
      unique: true,
      maxlength: [30, "Tag name cannot be more than 30 characters"],
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
      maxlength: [300, "Description cannot be more than 300 characters"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for posts with this tag
TagSchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "tags",
  justOne: false,
});

// Generate slug from name
TagSchema.pre("save", function (next) {
  if (!this.isModified("name")) return next();

  this.slug = this.name
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "-");

  next();
});

module.exports = mongoose.model("Tag", TagSchema);
