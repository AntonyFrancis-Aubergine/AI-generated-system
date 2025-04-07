import { z } from 'zod'
import { MESSAGES } from '../utils/messages'

/**
 * Validation schema for creating a fitness class
 */
export const createFitnessClassSchema = z
  .object({
    name: z
      .string()
      .nonempty({ message: MESSAGES.REQUIRED('Name') })
      .max(100, { message: MESSAGES.MAX('Name', 100) }),

    categoryId: z
      .string()
      .uuid({ message: MESSAGES.INVALID('Category ID') })
      .nonempty({ message: MESSAGES.REQUIRED('Category ID') }),

    instructorId: z
      .string()
      .uuid({ message: MESSAGES.INVALID('Instructor ID') })
      .nonempty({ message: MESSAGES.REQUIRED('Instructor ID') }),

    startsAt: z
      .string()
      .datetime({ message: MESSAGES.INVALID('Start time') })
      .nonempty({ message: MESSAGES.REQUIRED('Start time') }),

    endsAt: z
      .string()
      .datetime({ message: MESSAGES.INVALID('End time') })
      .nonempty({ message: MESSAGES.REQUIRED('End time') }),
  })
  .refine((data) => new Date(data.startsAt) < new Date(data.endsAt), {
    message: 'End time must be after start time',
    path: ['endsAt'],
  })

/**
 * Validation schema for updating a fitness class
 */
export const updateFitnessClassSchema = z
  .object({
    name: z
      .string()
      .max(100, { message: MESSAGES.MAX('Name', 100) })
      .optional(),

    categoryId: z
      .string()
      .uuid({ message: MESSAGES.INVALID('Category ID') })
      .optional(),

    instructorId: z
      .string()
      .uuid({ message: MESSAGES.INVALID('Instructor ID') })
      .optional(),

    startsAt: z
      .string()
      .datetime({ message: MESSAGES.INVALID('Start time') })
      .optional(),

    endsAt: z
      .string()
      .datetime({ message: MESSAGES.INVALID('End time') })
      .optional(),
  })
  .refine(
    (data) => {
      // Only check date comparison if both dates are provided
      if (data.startsAt && data.endsAt) {
        return new Date(data.startsAt) < new Date(data.endsAt)
      }
      return true
    },
    {
      message: 'End time must be after start time',
      path: ['endsAt'],
    }
  )
