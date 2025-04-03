import axios from 'axios'
import {
  ApiResponse,
  AuthResponse,
  Booking,
  CreateFitnessClassRequest,
  FitnessClass,
  FitnessClassFilters,
  LoginRequest,
  PaginatedResponse,
  RegisterRequest,
  UpdateFitnessClassRequest,
  User,
} from '../types'

const API_URL = 'http://localhost:3000/api/v1'
const ADMIN_API_URL = 'http://localhost:3000/api/admin'

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth Services
export const authService = {
  register: async (data: RegisterRequest): Promise<ApiResponse<User>> => {
    const response = await api.post<ApiResponse<User>>('/auth/register', data)
    return response.data
  },

  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    const response = await api.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      data
    )
    return response.data
  },
}

// Fitness Class Services (User)
export const fitnessClassService = {
  getClasses: async (
    filters?: FitnessClassFilters
  ): Promise<ApiResponse<PaginatedResponse<FitnessClass>>> => {
    const response = await api.get<
      ApiResponse<PaginatedResponse<FitnessClass>>
    >('/fitness-classes', {
      params: filters,
    })
    return response.data
  },

  bookClass: async (fitnessClassId: string): Promise<ApiResponse<Booking>> => {
    const response = await api.post<ApiResponse<Booking>>(
      `/fitness-classes/${fitnessClassId}`
    )
    return response.data
  },
}

// Booking Services
export const bookingService = {
  getBookings: async (
    page = 1,
    limit = 10
  ): Promise<ApiResponse<PaginatedResponse<Booking>>> => {
    const response = await api.get<ApiResponse<PaginatedResponse<Booking>>>(
      '/bookings',
      {
        params: { page, limit },
      }
    )
    return response.data
  },
}

// Admin Services
export const adminService = {
  getAllClasses: async (
    filters?: FitnessClassFilters
  ): Promise<ApiResponse<PaginatedResponse<FitnessClass>>> => {
    const adminApi = axios.create({
      baseURL: ADMIN_API_URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    const response = await adminApi.get<
      ApiResponse<PaginatedResponse<FitnessClass>>
    >('/fitness-classes', {
      params: filters,
    })
    return response.data
  },

  createClass: async (
    data: CreateFitnessClassRequest
  ): Promise<ApiResponse<FitnessClass>> => {
    const adminApi = axios.create({
      baseURL: ADMIN_API_URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    const response = await adminApi.post<ApiResponse<FitnessClass>>(
      '/fitness-classes',
      data
    )
    return response.data
  },

  updateClass: async (
    id: string,
    data: UpdateFitnessClassRequest
  ): Promise<ApiResponse<FitnessClass>> => {
    const adminApi = axios.create({
      baseURL: ADMIN_API_URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    const response = await adminApi.put<ApiResponse<FitnessClass>>(
      `/fitness-classes/${id}`,
      data
    )
    return response.data
  },

  deleteClass: async (id: string): Promise<ApiResponse<void>> => {
    const adminApi = axios.create({
      baseURL: ADMIN_API_URL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })

    const response = await adminApi.delete<ApiResponse<void>>(
      `/fitness-classes/${id}`
    )
    return response.data
  },
}
