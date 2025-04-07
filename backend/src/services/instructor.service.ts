import prisma from '../config/db'
import { FitnessClass } from '@prisma/client'
import { Pagination, PaginatedResult, InstructorTypes } from '../types'
import { APIError } from '../utils/customError'
import { STATUS_CODES } from '../utils/statusCodes'
import { MESSAGES } from '../utils/messages'

/**
 * Fetch all classes for which the user is an instructor
 * @param instructorId ID of the instructor (user)
 * @param pagination Pagination parameters
 * @returns Paginated result of fitness classes
 */
export const fetchInstructorClasses = async (
  instructorId: string,
  pagination: Pagination
): Promise<PaginatedResult<FitnessClass>> => {
  const { page, limit } = pagination
  const skip = (page - 1) * limit

  // Verify that user exists and is an instructor
  const instructor = await prisma.user.findUnique({
    where: {
      id: instructorId,
      role: 'INSTRUCTOR',
    },
  })

  if (!instructor) {
    throw new APIError(
      STATUS_CODES.CLIENT_ERROR.NOT_FOUND,
      MESSAGES.NOT_FOUND('Instructor'),
      true
    )
  }

  // Get total count for pagination metadata
  const totalItems = await prisma.fitnessClass.count({
    where: { instructorId },
  })

  // Fetch classes where the user is the instructor
  const classes = await prisma.fitnessClass.findMany({
    where: { instructorId },
    skip,
    take: limit,
    include: {
      category: true,
      bookings: true,
    },
    orderBy: {
      startsAt: 'asc', // Order by upcoming classes first
    },
  })

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalItems / limit)
  const hasNextPage = page < totalPages
  const hasPreviousPage = page > 1

  return {
    data: classes,
    meta: {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNextPage,
      hasPreviousPage,
    },
  }
}

/**
 * Fetch all instructors with pagination and optional name search
 * @param pagination Pagination parameters
 * @param nameSearch Optional search term for instructor name
 * @returns Paginated result of instructors with class count
 */
export const fetchAllInstructors = async (
  pagination: Pagination,
  nameSearch?: string
): Promise<PaginatedResult<InstructorTypes.InstructorWithClassCount>> => {
  const { page, limit } = pagination
  const skip = (page - 1) * limit

  // Build where clause for the query
  const whereClause: any = {
    role: 'INSTRUCTOR',
  }

  // Add name search if provided (case insensitive)
  if (nameSearch && nameSearch.trim() !== '') {
    whereClause.name = {
      contains: nameSearch.trim(),
      mode: 'insensitive',
    }
  }

  // Get total count for pagination metadata
  const totalItems = await prisma.user.count({
    where: whereClause,
  })

  // Fetch all users with INSTRUCTOR role and optional name filter
  const instructors = await prisma.user.findMany({
    where: whereClause,
    skip,
    take: limit,
    orderBy: {
      name: 'asc', // Order by name
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      mobile: true,
      address: true,
      dob: true,
      createdAt: true,
      updatedAt: true,
      // Exclude password for security
      // Include count of classes taught by instructor
      instructedClasses: {
        select: {
          id: true,
        },
      },
    },
  })

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalItems / limit)
  const hasNextPage = page < totalPages
  const hasPreviousPage = page > 1

  // Transform the instructors to include the count of classes
  const instructorsWithClassCount = instructors.map((instructor) => {
    const { instructedClasses, ...instructorData } = instructor
    return {
      ...instructorData,
      classCount: instructedClasses.length,
    } as InstructorTypes.InstructorWithClassCount
  })

  return {
    data: instructorsWithClassCount,
    meta: {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNextPage,
      hasPreviousPage,
    },
  }
}
