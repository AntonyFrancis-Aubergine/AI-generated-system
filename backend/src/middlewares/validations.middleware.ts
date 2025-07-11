import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'
import { STATUS_CODES } from '../utils/statusCodes'
import { MESSAGES } from '../utils/messages'
import { errorResponse } from '../utils/responseGenerator'

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validationResult = schema.safeParse(req.body)

    if (!validationResult.success) {
      const errorDetails = validationResult.error.errors
        .map((err) => err.message)
        .join(', ')
      res.status(STATUS_CODES.CLIENT_ERROR.BAD_REQUEST).json(
        errorResponse(MESSAGES.VALIDATION_ERR, errorDetails)
      )
      return
    }

    next()
  }
}
