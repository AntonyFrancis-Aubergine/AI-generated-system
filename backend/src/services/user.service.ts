import prisma from '../config/db'
import { Prisma, User } from '@prisma/client'
import { Pagination, AuthTypes } from '../types'
import { APIError } from '../utils/customError'
import { STATUS_CODES } from '../utils/statusCodes'
import { MESSAGES } from '../utils/messages'

/**
 * Fetch a single user by query
 * @param userQuery Query to find the user
 * @returns User without password or null if not found
 */
export const fetchSingleUser = async (
  userQuery: Prisma.UserWhereUniqueInput
): Promise<AuthTypes.UserResponse | null> => {
  const user = await prisma.user.findUnique({
    where: userQuery,
  })

  if (!user) {
    return null
  }

  // Exclude password from the response
  const { password, ...userWithoutPassword } = user
  return userWithoutPassword as AuthTypes.UserResponse
}

/**
 * Get user by ID
 * @param userId ID of the user to fetch
 * @returns User without password
 * @throws APIError if user is not found
 */
export const getUserById = async (
  userId: string
): Promise<AuthTypes.UserResponse> => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    throw new APIError(
      STATUS_CODES.CLIENT_ERROR.NOT_FOUND,
      MESSAGES.NOT_FOUND('User'),
      true
    )
  }

  // Exclude password from the response
  const { password, ...userWithoutPassword } = user
  return userWithoutPassword as AuthTypes.UserResponse
}

export const fetchUsersWithFiltersAndPagination = async (
  userQuery: Prisma.UserWhereInput,
  pagination: Pagination
): Promise<User[]> => {
  const { page, limit } = pagination
  const skip = (page - 1) * limit

  const users = await prisma.user.findMany({
    where: userQuery,
    skip,
    take: limit,
  })

  return users
}
