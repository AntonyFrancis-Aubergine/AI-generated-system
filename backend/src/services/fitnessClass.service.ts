import prisma from '../config/db'
import { Prisma, FitnessClass } from '@prisma/client'
import { Pagination, PaginatedResult, FitnessClassTypes } from '../types'
import { APIError } from '../utils/customError'
import { STATUS_CODES } from '../utils/statusCodes'
import { MESSAGES } from '../utils/messages'

export const fetchFitnessClass = async (
  fitnessClassQuery: Prisma.FitnessClassWhereInput
): Promise<FitnessClass | null> => {
  const fitnessClass = await prisma.fitnessClass.findFirst({
    where: fitnessClassQuery,
    include: {
      category: true,
      instructor: true,
      bookings: true,
    },
  })

  return fitnessClass
}

export const fetchFitnessClassesWithFiltersAndPagination = async (
  fitnessClassQuery: Prisma.FitnessClassWhereInput,
  pagination: Pagination
): Promise<PaginatedResult<FitnessClass>> => {
  const { page, limit } = pagination
  const skip = (page - 1) * limit

  // Get total count for pagination metadata
  const totalItems = await prisma.fitnessClass.count({
    where: fitnessClassQuery,
  })

  const fitnessClasses = await prisma.fitnessClass.findMany({
    where: fitnessClassQuery,
    skip,
    take: limit,
    include: {
      category: true,
      instructor: true,
      bookings: true,
    },
  })

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalItems / limit)
  const hasNextPage = page < totalPages
  const hasPreviousPage = page > 1

  return {
    data: fitnessClasses,
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
 * Check if an instructor has any conflicting classes during the specified time range
 * @param instructorId ID of the instructor
 * @param startsAt Start time of the class
 * @param endsAt End time of the class
 * @param excludeClassId Optional class ID to exclude from the check (useful for updates)
 * @returns true if conflicts exist, false otherwise
 */
export const checkInstructorConflicts = async (
  instructorId: string,
  startsAt: Date | string,
  endsAt: Date | string,
  excludeClassId?: string
): Promise<boolean> => {
  const startDate = new Date(startsAt)
  const endDate = new Date(endsAt)

  // Query to find any overlapping classes
  const whereCondition: Prisma.FitnessClassWhereInput = {
    instructorId,
    OR: [
      // Case 1: New class starts during an existing class
      {
        startsAt: { lte: startDate },
        endsAt: { gt: startDate },
      },
      // Case 2: New class ends during an existing class
      {
        startsAt: { lt: endDate },
        endsAt: { gte: endDate },
      },
      // Case 3: New class completely contains an existing class
      {
        startsAt: { gte: startDate },
        endsAt: { lte: endDate },
      },
    ],
  }

  // Add exclusion condition if provided
  if (excludeClassId) {
    whereCondition.NOT = { id: excludeClassId }
  }

  const conflictingClasses = await prisma.fitnessClass.findMany({
    where: whereCondition,
  })

  return conflictingClasses.length > 0
}

/**
 * Create a new fitness class
 * @param fitnessClassData Fitness class data to create
 * @returns Created fitness class
 */
export const createFitnessClass = async (
  fitnessClassData: FitnessClassTypes.CreateFitnessClassRequest
): Promise<FitnessClass> => {
  // Check if instructor exists
  const instructor = await prisma.user.findUnique({
    where: { id: fitnessClassData.instructorId },
  })

  if (!instructor) {
    throw new APIError(
      STATUS_CODES.CLIENT_ERROR.NOT_FOUND,
      MESSAGES.NOT_FOUND('Instructor'),
      true
    )
  }

  // Check if category exists
  const category = await prisma.fitnessClassCategory.findUnique({
    where: { id: fitnessClassData.categoryId },
  })

  if (!category) {
    throw new APIError(
      STATUS_CODES.CLIENT_ERROR.NOT_FOUND,
      MESSAGES.NOT_FOUND('Category'),
      true
    )
  }

  // Check for instructor time conflicts
  const hasConflicts = await checkInstructorConflicts(
    fitnessClassData.instructorId,
    fitnessClassData.startsAt,
    fitnessClassData.endsAt
  )

  if (hasConflicts) {
    throw new APIError(
      STATUS_CODES.CLIENT_ERROR.CONFLICT,
      MESSAGES.FITNESS_CLASS.INSTRUCTOR_CONFLICT,
      true
    )
  }

  // Parse dates
  const startsAt = new Date(fitnessClassData.startsAt)
  const endsAt = new Date(fitnessClassData.endsAt)

  // Create the fitness class
  const fitnessClass = await prisma.fitnessClass.create({
    data: {
      name: fitnessClassData.name,
      categoryId: fitnessClassData.categoryId,
      instructorId: fitnessClassData.instructorId,
      startsAt,
      endsAt,
    },
    include: {
      category: true,
      instructor: true,
    },
  })

  return fitnessClass
}

export const updateFitnessClass = async (
  fitnessClassId: string,
  fitnessClassData: Prisma.FitnessClassUpdateInput
): Promise<FitnessClass> => {
  const fitnessClass = await prisma.fitnessClass.update({
    where: { id: fitnessClassId },
    data: fitnessClassData,
    include: {
      category: true,
      instructor: true,
      bookings: true,
    },
  })

  return fitnessClass
}

export const deleteFitnessClass = async (
  fitnessClassId: string
): Promise<void> => {
  await prisma.fitnessClass.delete({
    where: { id: fitnessClassId },
  })
}
