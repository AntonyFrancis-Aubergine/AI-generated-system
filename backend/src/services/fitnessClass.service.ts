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
 * Check if an instructor has time conflicts with existing classes
 * @param instructorId ID of the instructor
 * @param startsAt Start time of the class
 * @param endsAt End time of the class
 * @param excludeClassId Optional ID of a class to exclude from conflict check (for updates)
 * @returns Boolean indicating if conflicts exist
 */
export const checkInstructorConflicts = async (
  instructorId: string,
  startsAt: string,
  endsAt: string,
  excludeClassId?: string
): Promise<boolean> => {
  const startDate = new Date(startsAt)
  const endDate = new Date(endsAt)

  // Build where clause to find overlapping classes
  const whereClause: Prisma.FitnessClassWhereInput = {
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

  // Exclude the class being updated if an ID is provided
  if (excludeClassId) {
    whereClause.id = { not: excludeClassId }
  }

  // Count overlapping classes
  const conflictCount = await prisma.fitnessClass.count({
    where: whereClause,
  })

  return conflictCount > 0
}

/**
 * Create a new fitness class
 * @param fitnessClassData Fitness class data to create
 * @returns Created fitness class
 */
export const createFitnessClass = async (
  fitnessClassData: FitnessClassTypes.CreateFitnessClassRequest
): Promise<FitnessClass> => {
  // Check if instructor exists and has INSTRUCTOR role
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

  // Verify instructor has INSTRUCTOR role
  if (instructor.role !== 'INSTRUCTOR') {
    throw new APIError(
      STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
      MESSAGES.FITNESS_CLASS.INVALID_INSTRUCTOR_ROLE,
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

/**
 * Update a fitness class by ID
 * @param fitnessClassId ID of the fitness class to update
 * @param fitnessClassData Data to update
 * @returns Updated fitness class
 */
export const updateFitnessClass = async (
  fitnessClassId: string,
  fitnessClassData: Prisma.FitnessClassUpdateInput
): Promise<FitnessClass> => {
  // Check if fitness class exists
  const existingClass = await prisma.fitnessClass.findUnique({
    where: { id: fitnessClassId },
  })

  if (!existingClass) {
    throw new APIError(
      STATUS_CODES.CLIENT_ERROR.NOT_FOUND,
      MESSAGES.NOT_FOUND('Fitness class'),
      true
    )
  }

  // Handle instructor check if provided
  if (fitnessClassData.instructor && 'connect' in fitnessClassData.instructor) {
    const instructorId = (fitnessClassData.instructor.connect as { id: string })
      .id
    const instructor = await prisma.user.findUnique({
      where: { id: instructorId },
    })

    if (!instructor) {
      throw new APIError(
        STATUS_CODES.CLIENT_ERROR.NOT_FOUND,
        MESSAGES.NOT_FOUND('Instructor'),
        true
      )
    }

    // Verify instructor has INSTRUCTOR role
    if (instructor.role !== 'INSTRUCTOR') {
      throw new APIError(
        STATUS_CODES.CLIENT_ERROR.BAD_REQUEST,
        MESSAGES.FITNESS_CLASS.INVALID_INSTRUCTOR_ROLE,
        true
      )
    }
  }

  // Handle category check if provided
  if (fitnessClassData.category && 'connect' in fitnessClassData.category) {
    const categoryId = (fitnessClassData.category.connect as { id: string }).id
    const category = await prisma.fitnessClassCategory.findUnique({
      where: { id: categoryId },
    })

    if (!category) {
      throw new APIError(
        STATUS_CODES.CLIENT_ERROR.NOT_FOUND,
        MESSAGES.NOT_FOUND('Category'),
        true
      )
    }
  }

  // Update the fitness class
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

/**
 * Delete a fitness class by ID
 * @param fitnessClassId ID of the fitness class to delete
 * @throws APIError if fitness class doesn't exist or has active bookings
 */
export const deleteFitnessClass = async (
  fitnessClassId: string
): Promise<void> => {
  // Check if fitness class exists with bookings included
  const fitnessClass = await prisma.fitnessClass.findUnique({
    where: { id: fitnessClassId },
    include: {
      bookings: true,
    },
  })

  if (!fitnessClass) {
    throw new APIError(
      STATUS_CODES.CLIENT_ERROR.NOT_FOUND,
      MESSAGES.NOT_FOUND('Fitness class'),
      true
    )
  }

  // Check if there are any bookings for this class
  if (fitnessClass.bookings && fitnessClass.bookings.length > 0) {
    throw new APIError(
      STATUS_CODES.CLIENT_ERROR.CONFLICT,
      'Cannot delete a fitness class that has active bookings',
      true
    )
  }

  // Delete the fitness class
  await prisma.fitnessClass.delete({
    where: { id: fitnessClassId },
  })
}
