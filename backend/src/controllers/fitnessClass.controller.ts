import { Request, Response } from 'express'
import { catchAsync } from '../utils/wrapper'
import { FitnessClassService } from '../services'
import { STATUS_CODES } from '../utils/statusCodes'
import { APIResponse } from '../utils/responseGenerator'
import { MESSAGES } from '../utils/messages'
import { FitnessClassTypes } from '../types'

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
