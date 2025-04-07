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
  Friendship,
  FriendshipStatus,
  FriendshipFilters,
  CreateFriendRequestRequest,
  UserActivity,
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
    try {
      const token = localStorage.getItem("token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Setting auth header with token");
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
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
      console.log("Calling instructors endpoint");
      // This is the correct endpoint according to the Postman collection
      const response = await api.get<ApiResponse<User[]>>("/users/instructors");
      console.log("Raw instructors response:", response);
      return response.data;
    } catch (error) {
      console.error("Error getting instructors:", error);
      throw handleApiError(error);
    }
  },

  getUserActivity: async (
    limit: number = 5
  ): Promise<ApiResponse<UserActivity[]>> => {
    try {
      const response = await api.get<ApiResponse<UserActivity[]>>(
        "/users/activity",
        {
          params: { limit },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error getting user activity:", error);
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
      console.log("Calling /categories endpoint with params:", { page, limit });
      const response = await api.get<ApiResponse<PaginatedResponse<Category>>>(
        "/categories",
        {
          params: { page, limit },
        }
      );
      console.log("Raw categories response:", response);
      return response.data;
    } catch (error) {
      console.error("Error getting categories:", error);
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

  // User Management
  getAllUsers: async (
    page = 1,
    limit = 10,
    name?: string
  ): Promise<ApiResponse<PaginatedResponse<User>>> => {
    try {
      console.log("Calling admin users endpoint with params:", {
        page,
        limit,
        name,
      });
      const response = await adminApi.get<ApiResponse<PaginatedResponse<User>>>(
        "/users",
        {
          params: { page, limit, name },
        }
      );
      console.log("Raw admin users response:", response);
      return response.data;
    } catch (error) {
      console.error("Error getting users from admin API:", error);
      throw handleApiError(error);
    }
  },

  deleteUser: async (userId: string): Promise<ApiResponse<void>> => {
    try {
      console.log(`Deleting user with ID: ${userId}`);
      const response = await adminApi.delete<ApiResponse<void>>(
        `/users/${userId}`
      );
      console.log("Delete user response:", response);
      return response.data;
    } catch (error) {
      console.error("Error deleting user:", error);
      throw handleApiError(error);
    }
  },

  // Fitness Class Management
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
      console.log(
        "Creating fitness class with data:",
        JSON.stringify(data, null, 2)
      );

      const response = await adminApi.post<ApiResponse<FitnessClass>>(
        "/fitness-classes",
        data
      );

      console.log("Create class response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating fitness class:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.error("Server response:", error.response.data);
        console.error("Status code:", error.response.status);
        console.error("Headers:", error.response.headers);
      }
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
      console.log("Calling admin instructors endpoint with params:", {
        page,
        limit,
        name,
      });
      const response = await adminApi.get<ApiResponse<PaginatedResponse<User>>>(
        "/instructors",
        {
          params: { page, limit, name },
        }
      );
      console.log("Raw admin instructors response:", response);
      return response.data;
    } catch (error) {
      console.error("Error getting instructors from admin API:", error);
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

// Friendship Services
export const friendshipService = {
  // Get all friendships with optional filtering
  getFriendships: async (
    filters?: FriendshipFilters
  ): Promise<ApiResponse<PaginatedResponse<Friendship>>> => {
    try {
      const response = await api.get<
        ApiResponse<PaginatedResponse<Friendship>>
      >("/friendships", { params: filters });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get pending friend requests
  getPendingFriendRequests: async (
    page = 1,
    limit = 10
  ): Promise<ApiResponse<PaginatedResponse<Friendship>>> => {
    try {
      const response = await api.get<
        ApiResponse<PaginatedResponse<Friendship>>
      >("/friendships/requests", { params: { page, limit } });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Send a friend request
  sendFriendRequest: async (
    data: CreateFriendRequestRequest
  ): Promise<ApiResponse<Friendship>> => {
    try {
      const response = await api.post<ApiResponse<Friendship>>(
        "/friendships/requests",
        data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get a specific friendship
  getFriendshipById: async (id: string): Promise<ApiResponse<Friendship>> => {
    try {
      const response = await api.get<ApiResponse<Friendship>>(
        `/friendships/${id}`
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Accept a friend request
  acceptFriendRequest: async (id: string): Promise<ApiResponse<Friendship>> => {
    try {
      const response = await api.put<ApiResponse<Friendship>>(
        `/friendships/${id}/accept`
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Reject a friend request
  rejectFriendRequest: async (id: string): Promise<ApiResponse<Friendship>> => {
    try {
      const response = await api.put<ApiResponse<Friendship>>(
        `/friendships/${id}/reject`
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Delete a friendship
  deleteFriendship: async (id: string): Promise<ApiResponse<void>> => {
    try {
      const response = await api.delete<ApiResponse<void>>(
        `/friendships/${id}`
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};
