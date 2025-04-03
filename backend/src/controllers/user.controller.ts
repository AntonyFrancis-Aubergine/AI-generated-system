import { Request, Response } from 'express'
import { catchAsync } from '../utils/wrapper'
import { UserService } from '../services'
import { STATUS_CODES } from '../utils/statusCodes'
import { APIResponse } from '../utils/responseGenerator'
import { MESSAGES } from '../utils/messages'

/**
 * Get user by ID
 */
export const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params

  // Get user by ID (will throw APIError if not found)
  const user = await UserService.getUserById(userId as string)

  return res.status(STATUS_CODES.SUCCESS.OK).json(
    APIResponse.sendSuccess({
      message: MESSAGES.RETRIEVE_SUCCESS('User'),
      data: user,
    })
  )
})
