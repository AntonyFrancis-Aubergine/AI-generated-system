import { prisma } from '../config/db'
import { PaginationParams, PaginatedResponse } from '../types/common.types'
import { UserListItem, UserListQueryParams } from '../types/user.types'
import { CONSTANTS } from '../utils/constants'
import { PrismaClient } from '@prisma/client'

const prismaClient = new PrismaClient()

/**
 * List users with pagination and filtering
 * @param queryParams Filtering parameters
 * @param paginationParams Pagination parameters
 * @returns Paginated list of users
 *
 * NOTE: Controllers should use the formatPaginatedResponse utility from utils/pagination.ts
 * to format the response according to the API standard (moving pagination to extra field)
 */
export const listUsers = async (
  queryParams: UserListQueryParams,
  paginationParams: PaginationParams
): Promise<PaginatedResponse<UserListItem>> => {
  const { name, email, role, isActive } = queryParams
  const { page, limit } = paginationParams

  // Set default pagination values
  const pageNumber = page || 1
  const pageSize = limit || CONSTANTS.PAGINATION_LIMIT
  const skip = (pageNumber - 1) * pageSize

  // Build where clause for filtering
  const whereClause: any = {}

  if (name) {
    whereClause.name = {
      contains: name,
      mode: 'insensitive',
    }
  }

  if (email) {
    whereClause.email = {
      contains: email,
      mode: 'insensitive',
    }
  }

  if (role) {
    whereClause.role = role
  }

  if (isActive !== undefined) {
    whereClause.isActive = isActive
  }

  // Get total count for pagination metadata
  const totalItems = await prisma.user.count({
    where: whereClause,
  })

  // Get users with pagination
  const users = await prisma.user.findMany({
    where: whereClause,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      contactNumber: true,
      profileImageUrl: true,
      isActive: true,
      createdAt: true,
      // Exclude password for security
      password: false,
    },
    skip,
    take: pageSize,
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / pageSize)

  return {
    data: users as UserListItem[],
    meta: {
      currentPage: pageNumber,
      pageSize,
      totalPages,
      totalItems,
    },
  }
}

/**
 * Get a user by ID
 * @param id User ID
 * @returns User or null if not found
 */
export const getUserById = async (id: string) => {
  const user = await prismaClient.user.findUnique({
    where: { id },
  })

  return user
}
