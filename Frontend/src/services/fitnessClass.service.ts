import api from "./api";
import {
  FitnessClass,
  FitnessClassCategory,
  FitnessClassFilters,
  CreateFitnessClassRequest,
  UpdateFitnessClassRequest,
  FitnessClassesResponse,
  FitnessClassBookingRequest,
} from "../types/fitnessClass";

export const fitnessClassService = {
  /**
   * Get all fitness classes with pagination and filters
   */
  async getClasses(
    page = 1,
    limit = 10,
    filters?: FitnessClassFilters
  ): Promise<FitnessClassesResponse> {
    const params = {
      page,
      limit,
      ...filters,
    };

    const response = await api.get("/api/v1/fitness-classes", { params });
    return response.data.data;
  },

  /**
   * Get a single fitness class by ID
   */
  async getClassById(id: string): Promise<FitnessClass> {
    const response = await api.get(`/api/v1/fitness-classes/${id}`);
    return response.data.data;
  },

  /**
   * Create a new fitness class (instructor or admin only)
   */
  async createClass(data: CreateFitnessClassRequest): Promise<FitnessClass> {
    const response = await api.post("/api/v1/fitness-classes", data);
    return response.data.data;
  },

  /**
   * Update an existing fitness class (instructor or admin only)
   */
  async updateClass(
    id: string,
    data: UpdateFitnessClassRequest
  ): Promise<FitnessClass> {
    const response = await api.put(`/api/v1/fitness-classes/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete a fitness class (instructor or admin only)
   */
  async deleteClass(id: string): Promise<void> {
    await api.delete(`/api/v1/fitness-classes/${id}`);
  },

  /**
   * Book a fitness class (user only)
   */
  async bookClass(data: FitnessClassBookingRequest): Promise<void> {
    await api.post("/api/v1/fitness-class-bookings", data);
  },

  /**
   * Cancel a booking (user only)
   */
  async cancelBooking(bookingId: string): Promise<void> {
    await api.delete(`/api/v1/fitness-class-bookings/${bookingId}`);
  },

  /**
   * Get all fitness class categories
   */
  async getCategories(): Promise<FitnessClassCategory[]> {
    const response = await api.get("/api/v1/fitness-class-categories");
    return response.data.data.categories;
  },

  /**
   * Get all fitness classes for a specific user
   */
  async getUserBookings(): Promise<FitnessClass[]> {
    const response = await api.get("/api/v1/user/bookings");
    return response.data.data.bookings;
  },

  /**
   * Get all fitness classes for an instructor
   */
  async getInstructorClasses(): Promise<FitnessClass[]> {
    const response = await api.get("/api/v1/instructor/classes");
    return response.data.data.classes;
  },

  /**
   * Check if user has booked a specific class
   */
  async isClassBooked(classId: string): Promise<boolean> {
    try {
      const response = await api.get(
        `/api/v1/fitness-class-bookings/check/${classId}`
      );
      return response.data.data.isBooked;
    } catch (error) {
      console.error("Error checking booking status:", error);
      return false;
    }
  },
};
