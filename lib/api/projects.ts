import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorMessage = error.response?.data?.error || 'Something went wrong';
    return Promise.reject(new Error(errorMessage));
  }
);

export const projectsApi = {
  // Get all projects
  getAll: (params?: { status?: string; category?: string }) => 
    api.get('/projects', { params }),
  
  // Get project updates
  getUpdates: (limit?: number) => 
    api.get('/projects/updates', { params: { limit } }),
};