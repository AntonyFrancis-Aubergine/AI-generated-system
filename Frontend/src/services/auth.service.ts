import api from "./api";
import { AuthResponse, LoginRequest, RegisterRequest } from "../types/auth";

export const authService = {
  /**
   * Login with credentials
   * @param data Login credentials
   * @returns Auth response containing user data and token
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await api.post(`/api/v1/auth/login`, data);
      console.log("Raw API response:", response);

      if (response.data && response.data.success) {
        const responseData = response.data.data;
        console.log("Processed response data:", responseData);
        return responseData;
      } else {
        throw new Error(response.data?.message || "Login failed");
      }
    } catch (error) {
      console.error("Auth service login error:", error);
      throw error;
    }
  },

  /**
   * Register a new user
   * @param data User registration data
   */
  async register(data: RegisterRequest): Promise<void> {
    await api.post(`/api/v1/auth/register`, data);
  },

  /**
   * Get the authentication token from local storage
   * @returns The token or null if not found
   */
  getToken(): string | null {
    return localStorage.getItem("token");
  },

  /**
   * Create an authorization header object with the token
   * @returns An object with the Authorization header
   */
  getAuthHeader() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },

  /**
   * Log the user out by removing token and user data from local storage
   */
  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};
