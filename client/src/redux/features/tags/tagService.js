import axios from "axios";

const API_URL = "/api/tags";

// Get all tags
const getAllTags = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Create new tag (Admin only)
const createTag = async (tagData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, tagData, config);
  return response.data;
};

// Update tag (Admin only)
const updateTag = async (id, tagData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(`${API_URL}/${id}`, tagData, config);
  return response.data;
};

// Delete tag (Admin only)
const deleteTag = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(`${API_URL}/${id}`, config);
  return response.data;
};

const tagService = {
  getAllTags,
  createTag,
  updateTag,
  deleteTag,
};

export default tagService;
