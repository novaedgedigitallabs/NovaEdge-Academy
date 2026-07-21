import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const apiGet = async (url, config = {}) => {
  const response = await api.get(url, config);
  return response.data;
};

export const apiPost = async (url, data = {}, config = {}) => {
  const response = await api.post(url, data, config);
  return response.data;
};

export const apiPut = async (url, data = {}, config = {}) => {
  const response = await api.put(url, data, config);
  return response.data;
};

export const apiDelete = async (url, config = {}) => {
  const response = await api.delete(url, config);
  return response.data;
};

export default api;
