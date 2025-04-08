// User Types
export enum UserRole {
  USER = "USER",
  INSTRUCTOR = "INSTRUCTOR",
  ADMIN = "ADMIN",
}

// Activity Types for User Dashboard
export enum ActivityType {
  BOOKING = "BOOKING",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
}

export interface UserActivity {
  id: string;
  type: ActivityType;
  title: string;
  date: string;
  relatedId?: string; // e.g., booking ID or class ID
  metadata?: Record<string, any>; // For additional data if needed
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
  capacity: number;
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
  capacity?: number;
}

export interface UpdateFitnessClassRequest {
  name?: string;
  categoryId?: string;
  instructorId?: string;
  startsAt?: string;
  endsAt?: string;
  capacity?: number;
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

// Add a FriendshipStatus enum that mirrors the backend
export enum FriendshipStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

export interface Friendship {
  id: string;
  status: FriendshipStatus;
  senderId: string;
  receiverId: string;
  createdAt: string;
  updatedAt: string;
  sender: {
    id: string;
    name: string;
    email: string;
  };
  receiver: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateFriendRequestRequest {
  receiverId: string;
}

export interface FriendshipFilters {
  status?: FriendshipStatus;
  page?: number;
  limit?: number;
}
