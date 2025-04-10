const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot be more than 200 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    excerpt: {
      type: String,
      required: [true, "Excerpt is required"],
      maxlength: [500, "Excerpt cannot be more than 500 characters"],
    },
    coverImage: {
      type: String,
      default:
        "https://res.cloudinary.com/demo/image/upload/v1580125061/samples/landscapes/default-blog-cover.jpg",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    readTime: {
      type: Number,
      default: 0,
    },
    scheduledFor: {
      type: Date,
      default: null,
    },
    seo: {
      title: { type: String, default: "" },
      description: { type: String, default: "" },
      keywords: { type: String, default: "" },
      ogImage: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for comments
PostSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "post",
  justOne: false,
});

// Indexing for better performance
PostSchema.index({ title: "text", content: "text", excerpt: "text" });
PostSchema.index({ slug: 1 });
PostSchema.index({ author: 1 });
PostSchema.index({ status: 1 });
PostSchema.index({ createdAt: -1 });

// Generate slug from title
PostSchema.pre("save", function (next) {
  if (!this.isModified("title")) return next();

  this.slug = this.title
    .toLowerCase()
    .replace(/[^\w\s]/gi, "")
    .replace(/\s+/g, "-")
    .concat("-", Date.now().toString().slice(-4));

  next();
});

// Calculate read time based on content length
PostSchema.pre("save", function (next) {
  if (!this.isModified("content")) return next();

  const wordCount = this.content.split(/\s+/).length;
  this.readTime = Math.ceil(wordCount / 200); // Average reading speed: 200 words per minute

  next();
});

module.exports = mongoose.model("Post", PostSchema);
