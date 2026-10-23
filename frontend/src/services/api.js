import axios from "axios";

// Automatically use the live Render API in production when running in cloud environments,
// while preserving local development server defaults.
const defaultBaseUrl =
  typeof window !== "undefined" &&
  window.location.hostname !== "localhost" &&
  window.location.hostname !== "127.0.0.1"
    ? "https://purrconnect-api.onrender.com/api"
    : "http://localhost:5000/api";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || defaultBaseUrl,
});

// Attach Bearer token from localStorage on every outgoing request if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle unauthenticated 401 errors gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If unauthorized on a protected endpoint, clear stale token
      const isAuthLogin = error.config?.url?.includes("/auth/login");
      if (!isAuthLogin) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
