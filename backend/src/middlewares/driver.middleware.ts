import { Request, Response, NextFunction } from 'express'
import { APIResponse } from '../utils/responseGenerator'
import { MESSAGES } from '../utils/messages'
import { STATUS_CODES } from '../utils/statusCodes'
import { UserRole } from '@prisma/client'
import { PrismaClient } from '@prisma/client'
import { IDriverProfile } from '../types'

const prisma = new PrismaClient()

// Extend Express Request to include driver profile
declare global {
  namespace Express {
    interface Request {
      driverProfile?: IDriverProfile
    }
  }
}

/**
 * Middleware to check if the user is a driver
 * @param req Express request
 * @param res Express response
 * @param next Express next function
 */
export const isDriver = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED).json(
        APIResponse.sendError({
          message: MESSAGES.FORBIDDEN_MSG,
        })
      )
      return
    }

    // Check if user has DRIVER role
    if (req.user.role !== UserRole.DRIVER) {
      res.status(STATUS_CODES.CLIENT_ERROR.FORBIDDEN).json(
        APIResponse.sendError({
          message: MESSAGES.FORBIDDEN_MSG,
        })
      )
      return
    }

    next()
  } catch (error) {
    next(error)
  }
}

/**
 * Middleware to check if the current driver has a valid profile
 * @param req Express request
 * @param res Express response
 * @param next Express next function
 */
export const hasDriverProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED).json(
        APIResponse.sendError({
          message: MESSAGES.FORBIDDEN_MSG,
        })
      )
      return
    }

    // Use raw query to avoid Prisma client type issues
    const driverProfiles = await prisma.$queryRaw`
      SELECT * FROM driver_profiles 
      WHERE "userId" = ${req.user.userId} AND "isActive" = true
    `

    const driverProfileArray = driverProfiles as any[]

    if (!driverProfileArray || driverProfileArray.length === 0) {
      res.status(STATUS_CODES.CLIENT_ERROR.FORBIDDEN).json(
        APIResponse.sendError({
          message: 'Active driver profile not found',
        })
      )
      return
    }

    // Attach driver profile to request
    req.driverProfile = driverProfileArray[0] as IDriverProfile

    next()
  } catch (error) {
    next(error)
  }
}
