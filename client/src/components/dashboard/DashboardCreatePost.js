import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Import Redux actions
import { createPost } from "../../redux/features/posts/postSlice";
import { getAllCategories } from "../../redux/features/categories/categorySlice";
import { getAllTags } from "../../redux/features/tags/tagSlice";

// Import components
import Spinner from "../../components/common/Spinner";

const DashboardCreatePost = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get data from Redux store
  const { categories, isLoading: isCategoriesLoading } = useSelector(
    (state) => state.categories || { categories: [] }
  );
  const { tags, isLoading: isTagsLoading } = useSelector(
    (state) => state.tags || { tags: [] }
  );
  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.posts
  );

  // Component state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    category: "",
    tags: [],
    status: "draft",
    featuredImage: null,
  });
  const [previewImage, setPreviewImage] = useState("");
  const [errors, setErrors] = useState({});

  // Destructure form data
  const {
    title,
    content,
    excerpt,
    category,
    tags: selectedTags,
    status,
    featuredImage,
  } = formData;

  // Fetch categories and tags on component mount
  useEffect(() => {
    dispatch(getAllCategories());
    dispatch(getAllTags());
  }, [dispatch]);

  // Handle success or error from post creation
  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess) {
      toast.success("Post created successfully!");
      navigate("/dashboard/posts");
    }
  }, [isError, isSuccess, message, navigate]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Handle rich text editor changes
  const handleContentChange = (value) => {
    setFormData({ ...formData, content: value });

    // Clear error when user starts typing
    if (errors.content) {
      setErrors({ ...errors, content: "" });
    }
  };

  // Handle tag selection
  const handleTagChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({ ...formData, tags: [...selectedTags, value] });
    } else {
      setFormData({
        ...formData,
        tags: selectedTags.filter((tag) => tag !== value),
      });
    }
  };

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, featuredImage: file });

      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!title.trim()) newErrors.title = "Title is required";
    if (title.length > 100)
      newErrors.title = "Title must be less than 100 characters";

    if (!content.trim()) newErrors.content = "Content is required";

    if (!category) newErrors.category = "Category is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    // Create FormData for file upload
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("excerpt", excerpt);
    postData.append("category", category);
    postData.append("status", status);

    selectedTags.forEach((tag) => {
      postData.append("tags", tag);
    });

    if (featuredImage) {
      postData.append("featuredImage", featuredImage);
    }

    dispatch(createPost(postData));
  };

  // Quill editor modules/formats
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  // Show loading spinner when data is loading
  if (isCategoriesLoading || isTagsLoading) {
    return <Spinner />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Helmet>
        <title>Create New Post | Dashboard</title>
      </Helmet>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create New Post</h1>
        <p className="text-gray-600">
          Create a new blog post for your audience
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="mb-6">
          <label htmlFor="title" className="form-label">
            Post Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className={`form-input ${errors.title ? "border-red-500" : ""}`}
            value={title}
            onChange={handleChange}
            placeholder="Enter post title"
          />
          {errors.title && <p className="form-error">{errors.title}</p>}
        </div>

        <div className="mb-6">
          <label htmlFor="content" className="form-label">
            Content <span className="text-red-500">*</span>
          </label>
          <ReactQuill
            id="content"
            theme="snow"
            modules={modules}
            value={content}
            onChange={handleContentChange}
            className={errors.content ? "border-red-500" : ""}
          />
          {errors.content && <p className="form-error">{errors.content}</p>}
        </div>

        <div className="mb-6">
          <label htmlFor="excerpt" className="form-label">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows="3"
            className="form-input"
            value={excerpt}
            onChange={handleChange}
            placeholder="Enter a short excerpt for your post (optional)"
          ></textarea>
          <p className="text-gray-500 text-sm mt-1">
            If left empty, an excerpt will be generated from your content
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="category" className="form-label">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              className={`form-input ${
                errors.category ? "border-red-500" : ""
              }`}
              value={category}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              {categories &&
                categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
            </select>
            {errors.category && <p className="form-error">{errors.category}</p>}
          </div>

          <div>
            <label htmlFor="status" className="form-label">
              Post Status
            </label>
            <select
              id="status"
              name="status"
              className="form-input"
              value={status}
              onChange={handleChange}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="form-label">Tags</label>
          <div className="flex flex-wrap gap-3 mt-1">
            {tags &&
              tags.map((tag) => (
                <div key={tag._id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`tag-${tag._id}`}
                    value={tag._id}
                    checked={selectedTags.includes(tag._id)}
                    onChange={handleTagChange}
                    className="mr-2"
                  />
                  <label htmlFor={`tag-${tag._id}`} className="text-gray-700">
                    {tag.name}
                  </label>
                </div>
              ))}
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="featuredImage" className="form-label">
            Featured Image
          </label>
          <input
            type="file"
            id="featuredImage"
            name="featuredImage"
            accept="image/*"
            onChange={handleImageChange}
            className="form-input"
          />
          {previewImage && (
            <div className="mt-3">
              <img
                src={previewImage}
                alt="Preview"
                className="w-full max-w-md rounded-lg border border-gray-200"
              />
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-8">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create Post"}
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate("/dashboard/posts")}
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default DashboardCreatePost;
