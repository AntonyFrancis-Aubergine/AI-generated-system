import { User, UserRole } from '@prisma/client'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { CONSTANTS } from '../utils/constants'
import { SignUpRequestBody, JwtPayload, AuthTokens } from '../types/auth.types'
import { APIError } from '../utils/customError'
import { STATUS_CODES } from '../utils/statusCodes'
import { MESSAGES } from '../utils/messages'
import { prisma } from '../config/db'

/**
 * Get user by email
 * @param email User email
 * @returns User or null if not found
 */
export const getUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { email },
  })
}

/**
 * Get user by ID
 * @param userId User ID
 * @returns User or null if not found
 */
export const getUserById = async (userId: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { id: userId },
  })
}

/**
 * Create a new user (Admin function)
 * @param userData User data
 * @returns Newly created user (without password)
 */
export const createUser = async (
  userData: SignUpRequestBody
): Promise<Omit<User, 'password'>> => {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(
      userData.password,
      CONSTANTS.AUTH.PASSWORD_SALT_ROUNDS
    )

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        contactNumber: userData.contactNumber || null,
        role: userData.role || UserRole.EMPLOYEE,
      },
    })

    // Remove password from the response
    const { password, ...userWithoutPassword } = newUser
    return userWithoutPassword
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    throw new APIError(
      STATUS_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR,
      MESSAGES.CREATE_FAILED('user'),
      true,
      error as Error
    )
  }
}

/**
 * Verify user password
 * @param providedPassword Password provided by the user
 * @param storedPasswordHash Stored hashed password
 * @returns Whether the password is valid
 */
export const verifyPassword = async (
  providedPassword: string,
  storedPasswordHash: string
): Promise<boolean> => {
  return bcrypt.compare(providedPassword, storedPasswordHash)
}

/**
 * Authenticate a user and generate JWT token
 * @param user User to authenticate
 * @returns Authentication token and user info
 */
export const authenticateUser = async (
  user: User
): Promise<{ tokens: AuthTokens; user: Omit<User, 'password'> }> => {
  // Generate token
  const tokens = generateToken(user)

  // Remove password from user object
  const { password, ...userWithoutPassword } = user

  return { tokens, user: userWithoutPassword }
}

/**
 * Logout a user
 * @param userId User ID
 */
// export const logoutUser = async (userId: string): Promise<void> => {
//   // Simply a placeholder for now since we're not using refresh tokens
//   // Could be used for audit logging or other logout-related tasks
// }

/**
 * Generate JWT access token
 * @param user User object
 * @returns Generated token
 */
const generateToken = (user: User): AuthTokens => {
  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  }

  const accessToken = jwt.sign(
    payload,
    process.env.JWT_ACCESS_SECRET || 'access-secret',
    { expiresIn: CONSTANTS.AUTH.ACCESS_TOKEN_EXPIRY } as jwt.SignOptions
  )

  // For compatibility with existing interfaces, we'll return both tokens
  // but refreshToken will be an empty string
  return {
    accessToken,
    refreshToken: '',
  }
}
