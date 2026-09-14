import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const getTasks = async () => {
  const response = await apiClient.get('/api/tasks');
  return response.data;
};

export const createTask = async (title) => {
  const response = await apiClient.post('/api/tasks', { title });
  return response.data;
};

export const updateTask = async (id, updates) => {
  const response = await apiClient.put(`/api/tasks/${id}`, updates);
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await apiClient.delete(`/api/tasks/${id}`);
  return response.data;
};

export default apiClient;
