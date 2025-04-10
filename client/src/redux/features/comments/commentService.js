import axios from "axios";

const API_URL = "/api/comments";

// Get comments for a post
const getPostComments = async (postId) => {
  const response = await axios.get(`/api/posts/${postId}/comments`);
  return response.data;
};

// Create new comment
const createComment = async (postId, commentData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(
    `/api/posts/${postId}/comments`,
    commentData,
    config
  );
  return response.data;
};

// Update comment
const updateComment = async (id, commentData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.put(`${API_URL}/${id}`, commentData, config);
  return response.data;
};

// Delete comment
const deleteComment = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(`${API_URL}/${id}`, config);
  return response.data;
};

const commentService = {
  getPostComments,
  createComment,
  updateComment,
  deleteComment,
};

export default commentService;
