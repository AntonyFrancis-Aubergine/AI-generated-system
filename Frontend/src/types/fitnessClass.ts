import { User } from "./auth";

export interface FitnessClassCategory {
  id: string;
  name: string;
  description: string | null;
}

export interface FitnessClassInstructor {
  id: string;
  name: string;
  email: string;
}

export interface FitnessClass {
  id: string;
  name: string;
  startsAt: string;
  endsAt: string;
  createdAt: string;
  updatedAt: string;
  categoryId: string;
  instructorId: string;

  // Relations
  category: FitnessClassCategory;
  instructor: FitnessClassInstructor;
  bookings?: FitnessClassBooking[];
}

export interface FitnessClassBooking {
  id: string;
  userId: string;
  fitnessClassId: string;
  createdAt: string;
  user?: User;
  fitnessClass?: FitnessClass;
}

export interface FitnessClassFilters {
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
  startsAt?: string;
  endsAt?: string;
}

export interface FitnessClassesResponse {
  classes: FitnessClass[];
  total: number;
  page: number;
  limit: number;
}

export interface FitnessClassCategoriesResponse {
  categories: FitnessClassCategory[];
}

export interface FitnessClassBookingRequest {
  fitnessClassId: string;
}
