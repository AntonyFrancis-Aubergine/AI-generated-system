import axios, { InternalAxiosRequestConfig } from "axios";

// Create an Axios instance with default configuration
const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL as string) || "http://localhost:3300",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the auth token in every request
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");

    // Only include the token if it exists
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common response patterns
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      // Only clear the token but don't force redirection
      // This will allow AuthContext to determine the proper action
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Don't redirect here - let the React components handle navigation
      // The next time a protected route is accessed, the AuthContext will handle it
    }

    return Promise.reject(error);
  }
);

export default api;
