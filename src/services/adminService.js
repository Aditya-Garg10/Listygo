import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const fetchAdminData = async () => {
  try {
    const response = await axios.get(`${API_URL}/admin/dashboard`);
    return response.data.data;
  } catch (error) {
    console.error("Admin fetch error: ", error);
    throw error;
  }
};