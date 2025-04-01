import { Request, Response } from 'express'
import { catchAsync } from '../utils/wrapper'
import { FitnessClassService } from '../services'
import { STATUS_CODES } from '../utils/statusCodes'
import { APIResponse } from '../utils/responseGenerator'
import { MESSAGES } from '../utils/messages'
import { FitnessClassTypes, Pagination } from '../types'
import { Prisma } from '@prisma/client'

/**
 * Create a new fitness class
 */
export const createFitnessClass = catchAsync(
  async (req: Request, res: Response) => {
    const fitnessClassData =
      req.body as FitnessClassTypes.CreateFitnessClassRequest

    const fitnessClass = await FitnessClassService.createFitnessClass(
      fitnessClassData
    )

    return res.status(STATUS_CODES.SUCCESS.CREATED).json(
      APIResponse.sendSuccess({
        message: MESSAGES.FITNESS_CLASS.CREATED,
        data: fitnessClass,
      })
    )
  }
)

/**
 * Get all fitness classes with filtering and pagination
 */
export const getAllFitnessClasses = catchAsync(
  async (req: Request, res: Response) => {
    const query = req.query as FitnessClassTypes.FitnessClassQueryParams

    // Build filter conditions
    const filterConditions: Prisma.FitnessClassWhereInput = {}

    // Name search (case insensitive)
    if (query.name) {
      filterConditions.name = {
        contains: query.name,
        mode: 'insensitive',
      }
    }

    // Category filter
    if (query.categoryId) {
      filterConditions.categoryId = query.categoryId
    }

    // Instructor filter
    if (query.instructorId) {
      filterConditions.instructorId = query.instructorId
    }

    // Date range filters
    if (query.startDateFrom || query.startDateTo) {
      filterConditions.startsAt = {}

      if (query.startDateFrom) {
        filterConditions.startsAt.gte = new Date(query.startDateFrom)
      }

      if (query.startDateTo) {
        filterConditions.startsAt.lte = new Date(query.startDateTo)
      }
    }

    // Parse pagination parameters with defaults
    const pagination: Pagination = {
      page: query.page ? parseInt(query.page, 10) : 1,
      limit: query.limit ? parseInt(query.limit, 10) : 10,
    }

    // Ensure pagination parameters are valid
    if (pagination.page < 1) pagination.page = 1
    if (pagination.limit < 1) pagination.limit = 10
    if (pagination.limit > 100) pagination.limit = 100

    // Get fitness classes with filters and pagination
    const result =
      await FitnessClassService.fetchFitnessClassesWithFiltersAndPagination(
        filterConditions,
        pagination
      )

    return res.status(STATUS_CODES.SUCCESS.OK).json(
      APIResponse.sendSuccess({
        message: MESSAGES.RETRIEVE_SUCCESS('Fitness classes'),
        data: result,
      })
    )
  }
)

/**
 * Get available fitness classes for users
 * Only shows upcoming classes that have more than 1 hour to start
 */
export const getAvailableFitnessClasses = catchAsync(
  async (req: Request, res: Response) => {
    const query = req.query as FitnessClassTypes.FitnessClassQueryParams

    // Current time
    const now = new Date()

    // Calculate time threshold (current time + 1 hour)
    const oneHourFromNow = new Date(now)
    oneHourFromNow.setHours(oneHourFromNow.getHours() + 1)

    // Build filter conditions with startsAt already defined as an object
    const filterConditions: Prisma.FitnessClassWhereInput = {
      // Only include classes that start after the one hour threshold
      startsAt: {
        gte: oneHourFromNow,
      },
    }

    // Name search (case insensitive)
    if (query.name) {
      filterConditions.name = {
        contains: query.name,
        mode: 'insensitive',
      }
    }

    // Category filter
    if (query.categoryId) {
      filterConditions.categoryId = query.categoryId
    }

    // Instructor filter
    if (query.instructorId) {
      filterConditions.instructorId = query.instructorId
    }

    // Additional date range filter (if provided)
    if (query.startDateFrom) {
      // Ensure the start date is not before the one hour threshold
      const startDate = new Date(query.startDateFrom)
      if (startDate > oneHourFromNow) {
        // We know startsAt is an object with gte property already defined
        ;(filterConditions.startsAt as Prisma.DateTimeFilter).gte = startDate
      }
    }

    if (query.startDateTo) {
      // We know startsAt is an object because we defined it above
      ;(filterConditions.startsAt as Prisma.DateTimeFilter).lte = new Date(
        query.startDateTo
      )
    }

    // Parse pagination parameters with defaults
    const pagination: Pagination = {
      page: query.page ? parseInt(query.page, 10) : 1,
      limit: query.limit ? parseInt(query.limit, 10) : 10,
    }

    // Ensure pagination parameters are valid
    if (pagination.page < 1) pagination.page = 1
    if (pagination.limit < 1) pagination.limit = 10
    if (pagination.limit > 100) pagination.limit = 100

    // Get fitness classes with filters and pagination
    const result =
      await FitnessClassService.fetchFitnessClassesWithFiltersAndPagination(
        filterConditions,
        pagination
      )

    return res.status(STATUS_CODES.SUCCESS.OK).json(
      APIResponse.sendSuccess({
        message: MESSAGES.RETRIEVE_SUCCESS('Available fitness classes'),
        data: result,
      })
    )
  }
)
