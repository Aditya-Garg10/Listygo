import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Configure axios to send credentials
axios.defaults.withCredentials = true;

// Axios interceptor to add token to all requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Register user
export const registerUser = async (userData, endpoint = '/api/register') => {
  const response = await axios.post(`${API_URL}${endpoint}`, userData);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('userRole', userData.role);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userName', userData.name);
    localStorage.setItem('userEmail', userData.email);
  }
  return response.data;
};

// Login user
export const loginUser = async (userData) => {
  const response = await axios.post(`${API_URL}/users/login`, userData);
  if (response.data.success) {
    storeUserData(response.data);
  }
  return response.data;
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('userId');
  localStorage.removeItem('userName');
  localStorage.removeItem('userRole');
  localStorage.removeItem('userEmail');
  
  // Call the logout endpoint
  return axios.get(`${API_URL}/users/logout`)
    .catch(err => console.error('Logout error:', err));
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true' && !!localStorage.getItem('token');
};

// Get current user data from localStorage
export const getCurrentUser = () => {
  return {
    id: localStorage.getItem('userId'),
    name: localStorage.getItem('userName'),
    role: localStorage.getItem('userRole'),
    email: localStorage.getItem('userEmail')
  };
};

// Fetch current logged-in user or admin based on a flag (you can set this flag after login)
export const fetchCurrentUser = async (isAdmin = false) => {
  const endpoint = isAdmin 
    ? `${API_URL}/admin/me`        // admin endpoint
    : `${API_URL}/users/me`;         // normal user endpoint
  const response = await axios.get(endpoint);
  return response.data.data;
  // Note: Errors will naturally propagate to the caller
};

// Update user details (e.g. preferences, profile info, etc.)
export const updateDetails = async (updateData) => {
  try {
    const response = await axios.put(`${API_URL}/users/updatedetails`, updateData);
    if (response.data.success) {
      // Optionally update localStorage with new data
      localStorage.setItem('userName', response.data.data.name);
      localStorage.setItem('userEmail', response.data.data.email);
    }
    return response.data;
  } catch (error) {
    console.error("Update user error: ", error);
    throw error;
  }
};

// Store user data in localStorage
const storeUserData = (data) => {
  const { token, user } = data;
  localStorage.setItem('token', token);
  localStorage.setItem('isAuthenticated', 'true');
  localStorage.setItem('userId', user.id);
  localStorage.setItem('userName', user.name);
  localStorage.setItem('userEmail', user.email);
  localStorage.setItem('userRole', 'user');
};