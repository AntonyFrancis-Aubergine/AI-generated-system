import { z } from 'zod'
import { CONSTANTS } from '../utils/constants'

/**
 * Validation schema for registration payload
 */
export const registerSchema = z.object({
  name: z.string().nonempty({ message: 'Name is required' }),
  email: z
    .string()
    .email({ message: 'Invalid email' })
    .nonempty({ message: 'Email is required' }),
  password: z.string().nonempty({ message: 'Password is required' }),
  role: z.enum([
    CONSTANTS.AUTH.ROLES.USER,
    CONSTANTS.AUTH.ROLES.INSTRUCTOR,
    CONSTANTS.AUTH.ROLES.ADMIN,
  ]),
  mobile: z.string().optional(),
  address: z.string().optional(),
  dob: z.string().date('Invalid date').optional(),
})

/**
 * Validation schema for login payload
 */
export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
  password: z.string().min(1, { message: 'Password is required' }),
})
