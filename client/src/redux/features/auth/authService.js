import axios from "axios";

const API_URL = "/api/auth";
const USERS_URL = "/api/users";

// Register user
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data.user));
    localStorage.setItem("token", response.data.token);
  }

  return response.data.user;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data.user));
    localStorage.setItem("token", response.data.token);
  }

  return response.data.user;
};

// Logout user
const logout = async () => {
  try {
    // Call the server-side logout endpoint if you need to
    const token = localStorage.getItem("token");
    if (token) {
      await axios.post(
        `${API_URL}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }
  } catch (error) {
    console.error("Logout error:", error);
  }

  // Clear localStorage regardless of server response
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

// Get current user
const getCurrentUser = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  try {
    const response = await axios.get(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.user;
  } catch (error) {
    // Handle token expiration or other auth errors
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    return null;
  }
};

// Update user profile
const updateProfile = async (userData) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(`${USERS_URL}/profile`, userData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data.data));
  }

  return response.data.data;
};

// Change password
const changePassword = async (passwordData) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(
    `${USERS_URL}/change-password`,
    passwordData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.message;
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  changePassword,
};

export default authService;
