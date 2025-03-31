import { z } from 'zod'
import { VehicleStatus } from '../types'
import { CONSTANTS } from '../utils/constants'
import { MESSAGES } from '../utils/messages'

// Create vehicle request schema
export const createVehicleSchema = z.object({
  registrationNumber: z
    .string()
    .trim()
    .min(1, { message: MESSAGES.REQUIRED('Registration number') })
    .max(20, {
      message: 'Registration number must be less than 20 characters',
    }),

  model: z
    .string()
    .trim()
    .min(1, { message: MESSAGES.REQUIRED('Model') }),

  make: z
    .string()
    .trim()
    .min(1, { message: MESSAGES.REQUIRED('Make') }),

  year: z
    .number()
    .int()
    .min(CONSTANTS.VEHICLE.MIN_YEAR, {
      message: `Year must be at least ${CONSTANTS.VEHICLE.MIN_YEAR}`,
    }),

  color: z
    .string()
    .trim()
    .min(1, { message: MESSAGES.REQUIRED('Color') }),

  seatingCapacity: z
    .number()
    .int()
    .min(1, { message: 'Seating capacity must be at least 1' })
    .max(CONSTANTS.VEHICLE.MAX_SEATING_CAPACITY, {
      message: `Seating capacity cannot exceed ${CONSTANTS.VEHICLE.MAX_SEATING_CAPACITY}`,
    }),

  fuelType: z
    .string()
    .trim()
    .min(1, { message: MESSAGES.REQUIRED('Fuel type') }),

  status: z.nativeEnum(VehicleStatus).optional().default(VehicleStatus.ACTIVE),
})

// Update vehicle request schema
export const updateVehicleSchema = z
  .object({
    registrationNumber: z
      .string()
      .trim()
      .min(1, { message: MESSAGES.REQUIRED('Registration number') })
      .max(20, {
        message: 'Registration number must be less than 20 characters',
      })
      .optional(),

    model: z
      .string()
      .trim()
      .min(1, { message: MESSAGES.REQUIRED('Model') })
      .optional(),

    make: z
      .string()
      .trim()
      .min(1, { message: MESSAGES.REQUIRED('Make') })
      .optional(),

    year: z
      .number()
      .int()
      .min(CONSTANTS.VEHICLE.MIN_YEAR, {
        message: `Year must be at least ${CONSTANTS.VEHICLE.MIN_YEAR}`,
      })
      .optional(),

    color: z
      .string()
      .trim()
      .min(1, { message: MESSAGES.REQUIRED('Color') })
      .optional(),

    seatingCapacity: z
      .number()
      .int()
      .min(1, { message: 'Seating capacity must be at least 1' })
      .max(CONSTANTS.VEHICLE.MAX_SEATING_CAPACITY, {
        message: `Seating capacity cannot exceed ${CONSTANTS.VEHICLE.MAX_SEATING_CAPACITY}`,
      })
      .optional(),

    fuelType: z
      .string()
      .trim()
      .min(1, { message: MESSAGES.REQUIRED('Fuel type') })
      .optional(),

    status: z.nativeEnum(VehicleStatus).optional(),

    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: MESSAGES.REQUIRED_ONE_FIELD,
  })

// Get vehicles query schema
export const getVehiclesQuerySchema = z.object({
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

  make: z.string().trim().optional(),

  model: z.string().trim().optional(),

  status: z.nativeEnum(VehicleStatus).optional(),

  isActive: z
    .string()
    .optional()
    .transform((val) => {
      if (val === 'true') return true
      if (val === 'false') return false
      return undefined
    }),

  isAssigned: z
    .string()
    .optional()
    .transform((val) => {
      if (val === 'true') return true
      if (val === 'false') return false
      return undefined
    }),
})

// Vehicle ID parameter schema
export const vehicleIdParamSchema = z.object({
  vehicleId: z.string().uuid({ message: 'Invalid vehicle ID format' }),
})
