import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { UserRole } from '@prisma/client'
import { STATUS_CODES } from '../utils/statusCodes'
import { MESSAGES } from '../utils/messages'
import { JwtPayload } from '../types/auth.types'
import { APIResponse } from '../utils/responseGenerator'

/**
 * Middleware to verify JWT access token
 * @param req Express request
 * @param res Express response
 * @param next Express next function
 */
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED).json(
      APIResponse.sendError({
        message: MESSAGES.INVALID('Authorization header'),
      })
    )
    return
  }

  const token = authHeader.split(' ')[1]

  try {
    // Verify token
    const decodedToken = jwt.verify(
      token as string,
      process.env.JWT_ACCESS_SECRET || 'access-secret'
    )

    // Cast to our expected JwtPayload type after verification
    const userPayload = decodedToken as unknown as JwtPayload

    // Check if payload has required fields
    if (!userPayload.userId || !userPayload.email || !userPayload.role) {
      res.status(STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED).json(
        APIResponse.sendError({
          message: MESSAGES.INVALID('Token format'),
        })
      )
      return
    }

    // Attach user info to request
    req.user = userPayload
    next()
  } catch (error) {
    // Handle specific JWT errors
    if (error instanceof jwt.TokenExpiredError) {
      res.status(STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED).json(
        APIResponse.sendError({
          message: MESSAGES.TOKEN_EXPIRED,
        })
      )
      return
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED).json(
        APIResponse.sendError({
          message: MESSAGES.INVALID('Token'),
        })
      )
      return
    }

    // For unexpected errors, pass to the error handler
    next(error)
  }
}

/**
 * Middleware to check if the user has the required role
 * @param allowedRoles Roles that are allowed to access the resource
 * @returns Express middleware
 */
export const requireRole = (allowedRoles: UserRole[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    if (!req.user) {
      res.status(STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED).json(
        APIResponse.sendError({
          message: MESSAGES.FORBIDDEN_MSG,
        })
      )
      return
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(STATUS_CODES.CLIENT_ERROR.FORBIDDEN).json(
        APIResponse.sendError({
          message: MESSAGES.FORBIDDEN_MSG,
        })
      )
      return
    }

    next()
  }
}
