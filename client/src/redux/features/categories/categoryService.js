import axios from "axios";

const API_URL = "/api/categories";

// Get all categories
const getCategories = async () => {
  const response = await axios.get(API_URL);
  return response.data.data;
};

// Get featured categories
const getFeaturedCategories = async () => {
  const response = await axios.get(`${API_URL}/featured/list`);
  return response.data.data;
};

// Get category by slug
const getCategoryBySlug = async (slug) => {
  const response = await axios.get(`${API_URL}/slug/${slug}`);
  return response.data.data;
};

// Create new category (admin only)
const createCategory = async (categoryData) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(API_URL, categoryData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};

// Update category (admin only)
const updateCategory = async (id, categoryData) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(`${API_URL}/${id}`, categoryData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};

// Delete category (admin only)
const deleteCategory = async (id) => {
  const token = localStorage.getItem("token");
  await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return id;
};

const categoryService = {
  getCategories,
  getFeaturedCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default categoryService;
