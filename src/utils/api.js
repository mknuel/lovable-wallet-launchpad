import axios from "axios";
import { API_VERSION, SERVER_URL } from "../config";

const _api = axios.create({
  baseURL: `${SERVER_URL}/api/${API_VERSION}`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10 * 1000, // 10 seconds timeout
});

// Request interceptor
_api.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

_api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const { response } = error;

    if (response && response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject({
      status: response?.status,
      message: response?.data?.message || "An error occurred",
      data: response?.data,
    });
  }
);

// Helper methods for common HTTP requests
const api = {
  get: (url, params = {}) => _api.get(url, { params }),

  post: (url, data = {}, config = {}) => _api.post(url, data, config),

  put: (url, data = {}) => _api.put(url, data),

  patch: (url, data = {}) => _api.patch(url, data),

  delete: (url) => _api.delete(url),

  upload: (url, formData) =>
    _api.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  request: (config) => _api(config),
};

export default api;
