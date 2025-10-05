
import axios from "axios";

const api = axios.create({
  baseURL: "https://uconnect-backend-2qnn.onrender.com/api", // <- works in React
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: add token automatically if stored
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
