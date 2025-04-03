import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import {
  ApiResponse,
  AuthResponse,
  Booking,
  Category,
  CreateFitnessClassRequest,
  FitnessClass,
  FitnessClassFilters,
  LoginRequest,
  PaginatedResponse,
  RegisterRequest,
  UpdateFitnessClassRequest,
  User,
} from "../types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";
const ADMIN_API_URL =
  import.meta.env.VITE_ADMIN_API_URL || "http://localhost:3000/api/admin";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // Add timeout for better user experience
});

// Create an admin-specific axios instance
const adminApi = axios.create({
  baseURL: ADMIN_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Helper to handle API errors consistently
const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiResponse<any>>;

    // Handle token expiration
    if (
      axiosError.response?.status === 401 &&
      axiosError.response?.data?.data?.expired
    ) {
      // Clear auth tokens and trigger logout
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login?session=expired";
    }

    // Use the error message from the API if available
    if (axiosError.response?.data?.message) {
      throw new Error(axiosError.response.data.message);
    }

    // Network errors
    if (axiosError.code === "ECONNABORTED") {
      throw new Error("Request timeout. Please try again.");
    }

    if (!axiosError.response) {
      throw new Error("Network error. Please check your connection.");
    }

    // Handle other status codes
    switch (axiosError.response.status) {
      case 404:
        throw new Error("Resource not found");
      case 403:
        throw new Error("You do not have permission to access this resource");
      case 500:
        throw new Error("Server error. Please try again later.");
      default:
        throw new Error(axiosError.message || "An unexpected error occurred");
    }
  }

  // For non-Axios errors
  throw error instanceof Error
    ? error
    : new Error("An unexpected error occurred");
};

// Configure request interceptors for all API instances
const configureInterceptors = (instance: AxiosInstance): void => {
  // Request interceptor
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Response interceptor
  instance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
  );
};

// Apply interceptors to both API instances
configureInterceptors(api);
configureInterceptors(adminApi);

// Auth Services
export const authService = {
  register: async (data: RegisterRequest): Promise<ApiResponse<User>> => {
    try {
      const response = await api.post<ApiResponse<User>>(
        "/auth/register",
        data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>(
        "/auth/login",
        data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  logout: (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

// User Services
export const userService = {
  getUserProfile: async (userId: string): Promise<ApiResponse<User>> => {
    try {
      const response = await api.get<ApiResponse<User>>(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getInstructors: async (): Promise<ApiResponse<User[]>> => {
    try {
      const response = await api.get<ApiResponse<User[]>>("/users/instructors");
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// Fitness Class Services (User)
export const fitnessClassService = {
  getClasses: async (
    filters?: FitnessClassFilters
  ): Promise<ApiResponse<PaginatedResponse<FitnessClass>>> => {
    try {
      const response = await api.get<
        ApiResponse<PaginatedResponse<FitnessClass>>
      >("/fitness-classes", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getClassById: async (
    fitnessClassId: string
  ): Promise<ApiResponse<FitnessClass>> => {
    try {
      const response = await api.get<ApiResponse<FitnessClass>>(
        `/fitness-classes/${fitnessClassId}`
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  bookClass: async (fitnessClassId: string): Promise<ApiResponse<Booking>> => {
    try {
      const response = await api.post<ApiResponse<Booking>>(
        `/fitness-classes/${fitnessClassId}`
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// Category Services
export const categoryService = {
  getCategories: async (
    page = 1,
    limit = 100
  ): Promise<ApiResponse<PaginatedResponse<Category>>> => {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<Category>>>(
        "/categories",
        {
          params: { page, limit },
        }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// Booking Services
export const bookingService = {
  getBookings: async (
    page = 1,
    limit = 10
  ): Promise<ApiResponse<PaginatedResponse<Booking>>> => {
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<Booking>>>(
        "/bookings",
        {
          params: { page, limit },
        }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  cancelBooking: async (bookingId: string): Promise<ApiResponse<void>> => {
    try {
      const response = await api.delete<ApiResponse<void>>(
        `/bookings/${bookingId}`
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// Admin Services
export const adminService = {
  // Dashboard statistics
  getDashboardStats: async (): Promise<
    ApiResponse<{
      totalUsers: number;
      activeClasses: number;
      revenue: number;
      growthRate: number;
      recentUsers: User[];
      popularClasses: FitnessClass[];
    }>
  > => {
    try {
      const response = await adminApi.get<
        ApiResponse<{
          totalUsers: number;
          activeClasses: number;
          revenue: number;
          growthRate: number;
          recentUsers: User[];
          popularClasses: FitnessClass[];
        }>
      >("/dashboard/stats");
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getAllClasses: async (
    filters?: FitnessClassFilters
  ): Promise<ApiResponse<PaginatedResponse<FitnessClass>>> => {
    try {
      const response = await adminApi.get<
        ApiResponse<PaginatedResponse<FitnessClass>>
      >("/fitness-classes", {
        params: filters,
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  createClass: async (
    data: CreateFitnessClassRequest
  ): Promise<ApiResponse<FitnessClass>> => {
    try {
      const response = await adminApi.post<ApiResponse<FitnessClass>>(
        "/fitness-classes",
        data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  updateClass: async (
    id: string,
    data: UpdateFitnessClassRequest
  ): Promise<ApiResponse<FitnessClass>> => {
    try {
      const response = await adminApi.put<ApiResponse<FitnessClass>>(
        `/fitness-classes/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  deleteClass: async (id: string): Promise<ApiResponse<void>> => {
    try {
      const response = await adminApi.delete<ApiResponse<void>>(
        `/fitness-classes/${id}`
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  getAllInstructors: async (
    page = 1,
    limit = 10,
    name?: string
  ): Promise<ApiResponse<PaginatedResponse<User>>> => {
    try {
      const response = await adminApi.get<ApiResponse<PaginatedResponse<User>>>(
        "/instructors",
        {
          params: { page, limit, name },
        }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

// Instructor Services
export const instructorService = {
  getInstructorClasses: async (
    page = 1,
    limit = 10
  ): Promise<ApiResponse<PaginatedResponse<FitnessClass>>> => {
    try {
      const response = await api.get<
        ApiResponse<PaginatedResponse<FitnessClass>>
      >("/instructors/classes", {
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
