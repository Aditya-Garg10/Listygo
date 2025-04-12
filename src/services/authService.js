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
export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/users/register`, userData);
  if (response.data.success) {
    storeUserData(response.data);
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

// Get fresh user data from API
export const fetchCurrentUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/me`);
    if (response.data.success) {
      // Update local storage with current values
      localStorage.setItem('userName', response.data.data.name);
      localStorage.setItem('userEmail', response.data.data.email);
    }
    return response.data.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    if (error.response && error.response.status === 401) {
      // Clear auth data if token is invalid/expired
      logoutUser();
    }
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