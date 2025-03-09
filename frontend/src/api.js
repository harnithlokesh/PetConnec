import axios from "axios";

const API_URL = "http://localhost:5000/api/users"; // Replace with your backend URL

export const fetchWallet = async (userId) => {
    const res = await fetch(`${API_URL}/users/${userId}/wallet`);
    return res.json();
};

// Register user
export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

// Login user
export const loginUser = async (userData) => {
  const response = await axios.post(`${API_URL}/login`, userData);
  if (response.data.token) {
    localStorage.setItem("token", response.data.token); // Store token in localStorage
  }
  return response.data;
};

// Get user profile
export const getUserProfile = async (token) => {
  const response = await axios.get(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Update user profile
export const updateUserProfile = async (token, userData) => {
  const response = await axios.put(`${API_URL}/update`, userData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};