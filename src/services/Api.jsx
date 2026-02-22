import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: `S{API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to add the JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (username, password) =>
    api.post("/auth/signin", { username, password }),

  register: (username, email, password) =>
    api.post("/auth/signup", { username, email, password }),

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

// Items API
export const itemsAPI = {
  getAll: () => api.get("/items"),

  getById: (id) => api.get(`/items/${id}`),

  create: (data) => api.post("/items", data),

  update: (id, data) => api.put(`/items/${id}`, data),

  delete: (id) => api.delete(`/items/${id}`),
};

export default api;
