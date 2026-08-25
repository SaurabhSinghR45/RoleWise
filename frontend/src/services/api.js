import axios from "axios";

/**
 * Centralized Axios instance with credentials enabled for HTTP-only cookies
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
