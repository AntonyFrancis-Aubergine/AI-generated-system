import prisma from '../config/db'
import { Prisma, FitnessClassBooking } from '@prisma/client'
import { Pagination } from '../types'
import { APIError } from '../utils/customError'
import { STATUS_CODES } from '../utils/statusCodes'
import { MESSAGES } from '../utils/messages'

/**
 * Fetch a single fitness class booking by query
 * @param bookingQuery Query to find the booking
 * @returns Fitness class booking or null if not found
 */
export const fetchFitnessClassBooking = async (
  bookingQuery: Prisma.FitnessClassBookingWhereInput
): Promise<FitnessClassBooking | null> => {
  const booking = await prisma.fitnessClassBooking.findFirst({
    where: bookingQuery,
  })

  return booking
}

/**
 * Fetch multiple fitness class bookings with filters and pagination
 * @param bookingQuery Query to filter bookings
 * @param pagination Pagination parameters
 * @returns Array of fitness class bookings
 */
export const fetchFitnessClassBookingsWithFiltersAndPagination = async (
  bookingQuery: Prisma.FitnessClassBookingWhereInput,
  pagination: Pagination
): Promise<FitnessClassBooking[]> => {
  const { page, limit } = pagination
  const skip = (page - 1) * limit

  const bookings = await prisma.fitnessClassBooking.findMany({
    where: bookingQuery,
    skip,
    take: limit,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          mobile: true,
        },
      },
      fitnessClass: {
        include: {
          category: true,
          instructor: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      },
    },
  })

  return bookings
}

/**
 * Create a new fitness class booking
 * @param bookingData Booking data to create
 * @returns Created fitness class booking
 */
export const createBooking = async (bookingData: {
  userId: string
  fitnessClassId: string
}): Promise<FitnessClassBooking> => {
  // Check if the user exists
  const user = await prisma.user.findUnique({
    where: { id: bookingData.userId },
  })

  if (!user) {
    throw new APIError(
      STATUS_CODES.CLIENT_ERROR.NOT_FOUND,
      MESSAGES.NOT_FOUND('User'),
      true
    )
  }

  // Check if the fitness class exists
  const fitnessClass = await prisma.fitnessClass.findUnique({
    where: { id: bookingData.fitnessClassId },
  })

  if (!fitnessClass) {
    throw new APIError(
      STATUS_CODES.CLIENT_ERROR.NOT_FOUND,
      MESSAGES.NOT_FOUND('Fitness class'),
      true
    )
  }

  // Check if booking already exists
  const existingBooking = await prisma.fitnessClassBooking.findFirst({
    where: {
      userId: bookingData.userId,
      fitnessClassId: bookingData.fitnessClassId,
    },
  })

  if (existingBooking) {
    throw new APIError(
      STATUS_CODES.CLIENT_ERROR.CONFLICT,
      MESSAGES.EXISTS('Booking'),
      true
    )
  }

  const booking = await prisma.fitnessClassBooking.create({
    data: {
      user: {
        connect: { id: bookingData.userId },
      },
      fitnessClass: {
        connect: { id: bookingData.fitnessClassId },
      },
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          mobile: true,
        },
      },
      fitnessClass: {
        include: {
          category: true,
          instructor: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      },
    },
  })

  return booking
}

/**
 * Update a fitness class booking
 * @param bookingId ID of the booking to update
 * @param bookingData Booking data to update
 * @returns Updated fitness class booking
 */
export const updateBooking = async (
  bookingId: string,
  bookingData: Prisma.FitnessClassBookingUpdateInput
): Promise<FitnessClassBooking> => {
  // Check if booking exists
  const existingBooking = await prisma.fitnessClassBooking.findUnique({
    where: { id: bookingId },
  })

  if (!existingBooking) {
    throw new APIError(
      STATUS_CODES.CLIENT_ERROR.NOT_FOUND,
      MESSAGES.NOT_FOUND('Booking'),
      true
    )
  }

  const booking = await prisma.fitnessClassBooking.update({
    where: { id: bookingId },
    data: bookingData,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          mobile: true,
        },
      },
      fitnessClass: {
        include: {
          category: true,
          instructor: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      },
    },
  })

  return booking
}

/**
 * Delete a fitness class booking
 * @param bookingId ID of the booking to delete
 */
export const deleteBooking = async (bookingId: string): Promise<void> => {
  // Check if booking exists
  const existingBooking = await prisma.fitnessClassBooking.findUnique({
    where: { id: bookingId },
  })

  if (!existingBooking) {
    throw new APIError(
      STATUS_CODES.CLIENT_ERROR.NOT_FOUND,
      MESSAGES.NOT_FOUND('Booking'),
      true
    )
  }

  await prisma.fitnessClassBooking.delete({
    where: { id: bookingId },
  })
}

/**
 * Get bookings for a specific user
 * @param userId ID of the user
 * @param pagination Pagination parameters
 * @returns Array of fitness class bookings
 */
export const getUserBookings = async (
  userId: string,
  pagination: Pagination
): Promise<FitnessClassBooking[]> => {
  const { page, limit } = pagination
  const skip = (page - 1) * limit

  // Check if user exists
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

  const bookings = await prisma.fitnessClassBooking.findMany({
    where: { userId },
    skip,
    take: limit,
    include: {
      fitnessClass: {
        include: {
          category: true,
          instructor: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return bookings
}

/**
 * Get bookings for a specific fitness class
 * @param fitnessClassId ID of the fitness class
 * @param pagination Pagination parameters
 * @returns Array of fitness class bookings
 */
export const getClassBookings = async (
  fitnessClassId: string,
  pagination: Pagination
): Promise<FitnessClassBooking[]> => {
  const { page, limit } = pagination
  const skip = (page - 1) * limit

  // Check if fitness class exists
  const fitnessClass = await prisma.fitnessClass.findUnique({
    where: { id: fitnessClassId },
  })

  if (!fitnessClass) {
    throw new APIError(
      STATUS_CODES.CLIENT_ERROR.NOT_FOUND,
      MESSAGES.NOT_FOUND('Fitness class'),
      true
    )
  }

  const bookings = await prisma.fitnessClassBooking.findMany({
    where: { fitnessClassId },
    skip,
    take: limit,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          mobile: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return bookings
}
