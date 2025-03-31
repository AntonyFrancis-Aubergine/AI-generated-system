import { z } from 'zod'
import { CONSTANTS } from '../utils/constants'
import { MESSAGES } from '../utils/messages'

// Helper function to validate date is in the future
const isFutureDate = (date: Date) => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date > today
}

// Create driver profile schema
export const createDriverProfileSchema = z.object({
  userId: z
    .string()
    .uuid({ message: 'Invalid user ID format' })
    .min(1, { message: MESSAGES.REQUIRED('User ID') }),

  licenseNumber: z
    .string()
    .trim()
    .min(1, { message: MESSAGES.REQUIRED('License number') })
    .max(50, { message: 'License number must be less than 50 characters' }),

  licenseExpiry: z
    .string()
    .min(1, { message: MESSAGES.REQUIRED('License expiry date') })
    .transform((val) => new Date(val))
    .refine((date) => !isNaN(date.getTime()), {
      message: 'Invalid license expiry date format',
    })
    .refine(isFutureDate, {
      message: MESSAGES.DRIVER.INVALID_LICENSE_EXPIRY,
    }),

  experienceYears: z
    .number()
    .int()
    .min(CONSTANTS.DRIVER.MIN_EXPERIENCE_YEARS, {
      message: `Experience years must be at least ${CONSTANTS.DRIVER.MIN_EXPERIENCE_YEARS}`,
    })
    .max(CONSTANTS.DRIVER.MAX_EXPERIENCE_YEARS, {
      message: `Experience years cannot exceed ${CONSTANTS.DRIVER.MAX_EXPERIENCE_YEARS}`,
    })
    .optional(),

  isAvailable: z.boolean().optional().default(true),
})

// Update driver profile schema
export const updateDriverProfileSchema = z
  .object({
    licenseNumber: z
      .string()
      .trim()
      .min(1, { message: MESSAGES.REQUIRED('License number') })
      .max(50, { message: 'License number must be less than 50 characters' })
      .optional(),

    licenseExpiry: z
      .string()
      .transform((val) => (val ? new Date(val) : undefined))
      .refine((date) => !date || !isNaN(date.getTime()), {
        message: 'Invalid license expiry date format',
      })
      .refine((date) => !date || isFutureDate(date), {
        message: MESSAGES.DRIVER.INVALID_LICENSE_EXPIRY,
      })
      .optional(),

    experienceYears: z
      .number()
      .int()
      .min(CONSTANTS.DRIVER.MIN_EXPERIENCE_YEARS, {
        message: `Experience years must be at least ${CONSTANTS.DRIVER.MIN_EXPERIENCE_YEARS}`,
      })
      .max(CONSTANTS.DRIVER.MAX_EXPERIENCE_YEARS, {
        message: `Experience years cannot exceed ${CONSTANTS.DRIVER.MAX_EXPERIENCE_YEARS}`,
      })
      .optional(),

    rating: z
      .number()
      .min(CONSTANTS.DRIVER.MIN_RATING, {
        message: `Rating must be at least ${CONSTANTS.DRIVER.MIN_RATING}`,
      })
      .max(CONSTANTS.DRIVER.MAX_RATING, {
        message: `Rating cannot exceed ${CONSTANTS.DRIVER.MAX_RATING}`,
      })
      .optional(),

    isAvailable: z.boolean().optional(),

    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: MESSAGES.REQUIRED_ONE_FIELD,
  })

// Update driver availability schema
export const updateDriverAvailabilitySchema = z.object({
  isAvailable: z.boolean().refine((val) => val !== undefined, {
    message: MESSAGES.REQUIRED('Availability status'),
  }),
})

// Get driver profiles query schema
export const getDriverProfilesQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .refine((val) => !val || (val && val > 0), {
      message: 'Page number must be a positive integer',
    }),

  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .refine((val) => !val || (val && val > 0), {
      message: 'Limit must be a positive integer',
    }),

  isAvailable: z
    .string()
    .optional()
    .transform((val) => {
      if (val === 'true') return true
      if (val === 'false') return false
      return undefined
    }),

  isActive: z
    .string()
    .optional()
    .transform((val) => {
      if (val === 'true') return true
      if (val === 'false') return false
      return undefined
    }),

  hasVehicle: z
    .string()
    .optional()
    .transform((val) => {
      if (val === 'true') return true
      if (val === 'false') return false
      return undefined
    }),

  minExperience: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : undefined))
    .refine((val) => !val || val >= CONSTANTS.DRIVER.MIN_EXPERIENCE_YEARS, {
      message: `Minimum experience must be at least ${CONSTANTS.DRIVER.MIN_EXPERIENCE_YEARS}`,
    }),

  minRating: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : undefined))
    .refine(
      (val) =>
        !val ||
        (val >= CONSTANTS.DRIVER.MIN_RATING &&
          val <= CONSTANTS.DRIVER.MAX_RATING),
      {
        message: `Minimum rating must be between ${CONSTANTS.DRIVER.MIN_RATING} and ${CONSTANTS.DRIVER.MAX_RATING}`,
      }
    ),
})

// Driver ID parameter schema
export const driverIdParamSchema = z.object({
  driverId: z.string().uuid({ message: 'Invalid driver ID format' }),
})

// User ID parameter schema
export const userIdParamSchema = z.object({
  userId: z.string().uuid({ message: 'Invalid user ID format' }),
})

// Assign vehicle request schema
export const assignVehicleSchema = z.object({
  vehicleId: z
    .string()
    .uuid({ message: 'Invalid vehicle ID format' })
    .min(1, { message: MESSAGES.REQUIRED('Vehicle ID') }),
})
