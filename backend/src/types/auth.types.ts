import { z } from 'zod'
import { UserRole } from '@prisma/client'

// User types
export interface IUser {
  id: string
  email: string
  name: string
  role: UserRole
  contactNumber?: string | null
  profileImageUrl?: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

// JWT Payload type
export interface JwtPayload {
  userId: string
  email: string
  role: UserRole
}

// Auth token types
export interface AuthTokens {
  accessToken: string
  refreshToken: string // Keeping for compatibility but will be empty
}

export interface AuthResponse extends AuthTokens {
  user: Omit<IUser, 'password'>
}

// Sign up request validation schema
export const SignUpSchema = z.object({
  email: z.string().nonempty().email(),
  password: z.string().nonempty(),
  name: z.string().nonempty(),
  contactNumber: z.string().length(10),
  role: z.nativeEnum(UserRole).optional(),
})

// Sign in request validation schema
export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

// Request body types
export type SignUpRequestBody = z.infer<typeof SignUpSchema>
export type SignInRequestBody = z.infer<typeof SignInSchema>
