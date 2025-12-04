import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  // FIX: Removed manual Content-Type header
  register: (formData) => api.post('/auth/register', formData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/profile'),
};

// Listings API
export const listingsAPI = {
  getAll: (params) => api.get('/listings', { params }),
  getById: (id) => api.get(`/listings/${id}`),
  getUserListings: () => api.get('/listings/user'),
  // FIX: Removed manual Content-Type header
  create: (formData) => api.post('/listings', formData),
  // FIX: Removed manual Content-Type header
  update: (id, data) => api.put(`/listings/${id}`, data),
  delete: (id) => api.delete(`/listings/${id}`),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
};

export default api;