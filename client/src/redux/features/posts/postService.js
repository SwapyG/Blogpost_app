import axios from "axios";

const API_URL = "/api/posts";

// Helper function to build query string
const buildQueryString = (params) => {
  if (!params) return "";

  const queryParams = new URLSearchParams();

  for (const key in params) {
    if (
      params[key] !== undefined &&
      params[key] !== null &&
      params[key] !== ""
    ) {
      queryParams.append(key, params[key]);
    }
  }

  return queryParams.toString() ? `?${queryParams.toString()}` : "";
};

// Get all posts with optional filters
const getPosts = async (params) => {
  const queryString = buildQueryString(params);
  const response = await axios.get(`${API_URL}${queryString}`);
  return {
    data: response.data.data,
    pagination: response.data.pagination,
  };
};

// Get single post by slug
const getPostBySlug = async (slug) => {
  const response = await axios.get(`${API_URL}/slug/${slug}`);
  return response.data;
};

// Get posts by category
const getPostsByCategory = async (categorySlug, params) => {
  const queryString = buildQueryString({
    ...params,
    category: categorySlug,
  });
  const response = await axios.get(`${API_URL}${queryString}`);
  return {
    data: response.data.data,
    pagination: response.data.pagination,
  };
};

// Get posts by tag
const getPostsByTag = async (tagSlug, params) => {
  const queryString = buildQueryString({
    ...params,
    tag: tagSlug,
  });
  const response = await axios.get(`${API_URL}${queryString}`);
  return {
    data: response.data.data,
    pagination: response.data.pagination,
  };
};

// Get posts by author
const getPostsByAuthor = async (userId, params) => {
  const response = await axios.get(
    `${API_URL}/user/${userId}${buildQueryString(params)}`
  );
  return {
    data: response.data.data,
    pagination: response.data.pagination,
  };
};

// Get user posts (dashboard)
const getUserPosts = async (params) => {
  const token = localStorage.getItem("token");
  const response = await axios.get(
    `${API_URL}/dashboard/myposts${buildQueryString(params)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return {
    data: response.data.data,
    pagination: response.data.pagination,
  };
};

// Create new post
const createPost = async (postData) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(API_URL, postData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Update post
const updatePost = async (id, postData) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(`${API_URL}/${id}`, postData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// Delete post
const deletePost = async (id) => {
  const token = localStorage.getItem("token");
  await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return { id };
};

// Search posts
const searchPosts = async (params) => {
  const queryString = buildQueryString(params);
  const response = await axios.get(`${API_URL}${queryString}`);
  return {
    data: response.data.data,
    pagination: response.data.pagination,
  };
};

const postService = {
  getPosts,
  getPostBySlug,
  getPostsByCategory,
  getPostsByTag,
  getPostsByAuthor,
  getUserPosts,
  createPost,
  updatePost,
  deletePost,
  searchPosts,
};

export default postService;
