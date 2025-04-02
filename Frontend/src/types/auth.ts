export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "INSTRUCTOR" | "USER";
  mobile?: string;
  address?: string;
  dob?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: "USER" | "INSTRUCTOR" | "ADMIN";
  mobile?: string;
  address?: string;
  dob?: string;
}
