import api from "./api";
import {
  FitnessClass,
  FitnessClassesResponse,
  CreateFitnessClassRequest,
  UpdateFitnessClassRequest,
} from "../types/fitnessClass";

export const adminService = {
  /**
   * Get all fitness classes (admin only)
   */
  async getAllClasses(page = 1, limit = 10): Promise<FitnessClassesResponse> {
    const params = { page, limit };
    const response = await api.get("/api/admin/fitness-classes", { params });
    return response.data.data;
  },

  /**
   * Get a single fitness class by ID (admin only)
   */
  async getClassById(id: string): Promise<FitnessClass> {
    const response = await api.get(`/api/admin/fitness-classes/${id}`);
    return response.data.data;
  },

  /**
   * Create a new fitness class (admin only)
   */
  async createClass(data: CreateFitnessClassRequest): Promise<FitnessClass> {
    const response = await api.post("/api/admin/fitness-classes", data);
    return response.data.data;
  },

  /**
   * Update an existing fitness class (admin only)
   */
  async updateClass(
    id: string,
    data: UpdateFitnessClassRequest
  ): Promise<FitnessClass> {
    const response = await api.put(`/api/admin/fitness-classes/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete a fitness class (admin only)
   */
  async deleteClass(id: string): Promise<void> {
    await api.delete(`/api/admin/fitness-classes/${id}`);
  },

  /**
   * Get all users (admin only) - This endpoint is not in the Postman collection but would likely be needed
   */
  async getAllUsers(page = 1, limit = 10): Promise<any> {
    const params = { page, limit };
    const response = await api.get("/api/admin/users", { params });
    return response.data.data;
  },

  /**
   * Get all instructors (admin only) - This endpoint is not in the Postman collection but would likely be needed
   */
  async getAllInstructors(page = 1, limit = 10): Promise<any> {
    const params = { page, limit };
    const response = await api.get("/api/admin/instructors", { params });
    return response.data.data;
  },
};
