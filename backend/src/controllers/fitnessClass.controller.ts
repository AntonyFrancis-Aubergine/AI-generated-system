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
