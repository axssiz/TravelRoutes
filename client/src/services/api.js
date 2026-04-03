// client/src/services/api.js
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

// Создание экземпляра axios
const api = axios.create({
  baseURL: API_BASE_URL,
  // Убираем default Content-Type для поддержки FormData
});

// Добавление токена в заголовок при каждом запросе
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Обработка ошибок ответа
api.interceptors.response.use(
  (response) => {
    console.log(
      "✅ API Response:",
      response.config.url,
      "Status:",
      response.status,
    );
    return response;
  },
  (error) => {
    console.error(
      "❌ API Error:",
      error.config?.url,
      error.response?.status,
      error.message,
    );
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Auth API
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data) => api.put("/auth/profile", data),
};

// Hotels API
export const hotelsAPI = {
  getAll: (filters) => api.get("/hotels", { params: filters }),
  getById: (id) => api.get(`/hotels/${id}`),
  getCities: () => api.get("/hotels/cities"),
  create: (data) => api.post("/hotels", data),
  update: (id, data) => api.put(`/hotels/${id}`, data),
  delete: (id) => api.delete(`/hotels/${id}`),
};

// Routes API
export const routesAPI = {
  getUserRoutes: (page = 1, limit = 10) =>
    api.get("/routes/my-routes", { params: { page, limit } }),
  search: (origin, destination) =>
    api.get("/routes/search", { params: { origin, destination } }),
  getById: (id) => api.get(`/routes/${id}`),
  create: (data) => api.post("/routes", data),
  update: (id, data) => api.put(`/routes/${id}`, data),
  delete: (id) => api.delete(`/routes/${id}`),
  getAllRoutes: (page = 1, limit = 10) =>
    api.get("/routes/admin/all-routes", { params: { page, limit } }),
};

// Favorites API
export const favoritesAPI = {
  getAll: () => api.get("/favorites"),
  addHotel: (hotelId) => api.post("/favorites/hotel", { hotelId }),
  addRoute: (routeId) => api.post("/favorites/route", { routeId }),
  remove: (id) => api.delete(`/favorites/${id}`),
  check: (hotelId, routeId) =>
    api.get("/favorites/check", { params: { hotelId, routeId } }),
};

// Admin API
export const adminAPI = {
  getStats: () => api.get("/admin/stats"),
  getAllUsers: () => api.get("/admin/users"),
  updateUserRole: (userId, role) =>
    api.put(`/admin/users/${userId}/role`, { role }),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
};

export default api;
