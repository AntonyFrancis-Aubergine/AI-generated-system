// User Types
export enum UserRole {
  USER = "USER",
  INSTRUCTOR = "INSTRUCTOR",
  ADMIN = "ADMIN",
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  mobile?: string;
  address?: string;
  dob?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Auth Types
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  mobile?: string;
  address?: string;
  dob?: string;
  adminCode?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Fitness Class Types
export interface FitnessClass {
  id: string;
  name: string;
  categoryId: string;
  category?: Category;
  instructorId: string;
  instructor?: User;
  startsAt: string;
  endsAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FitnessClassFilters {
  page?: number;
  limit?: number;
  name?: string;
  categoryId?: string;
  instructorId?: string;
  startDateFrom?: string;
  startDateTo?: string;
}

export interface CreateFitnessClassRequest {
  name: string;
  categoryId: string;
  instructorId: string;
  startsAt: string;
  endsAt: string;
}

export interface UpdateFitnessClassRequest {
  name?: string;
  categoryId?: string;
  instructorId?: string;
  startsAt?: string;
  endsAt?: string;
}

// Booking Types
export interface Booking {
  id: string;
  userId: string;
  fitnessClassId: string;
  fitnessClass?: FitnessClass;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
