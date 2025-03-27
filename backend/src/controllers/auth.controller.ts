import { Request, Response, NextFunction } from 'express'
import {
  createUser as createUserService,
  getUserByEmail,
  // getUserById,
  verifyPassword,
  authenticateUser,
} from '../services/auth.service'
import { SignUpRequestBody, SignInRequestBody } from '../types/auth.types'
import { STATUS_CODES } from '../utils/statusCodes'
import { MESSAGES } from '../utils/messages'
import { APIResponse } from '../utils/responseGenerator'
import { catchAsync } from '../utils/wrapper'

/**
 * Create a new user (Admin only)
 * @param req Express request
 * @param res Express response
 * @param next Express next function
 */
export const createUser = catchAsync(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const userData: SignUpRequestBody = req.body

    // Check if user already exists
    const existingUser = await getUserByEmail(userData.email)
    if (existingUser) {
      res.status(STATUS_CODES.CLIENT_ERROR.CONFLICT).json(
        APIResponse.sendError({
          message: MESSAGES.EXISTS('User with this email'),
        })
      )
      return
    }

    const user = await createUserService(userData)

    res.status(STATUS_CODES.SUCCESS.CREATED).json(
      APIResponse.sendSuccess({
        message: MESSAGES.CREATE_SUCCESS('User account'),
        data: { user },
      })
    )
  }
)

/**
 * Login a user
 * @param req Express request
 * @param res Express response
 * @param next Express next function
 */
export const login = catchAsync(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const credentials: SignInRequestBody = req.body

    // Find user by email
    const user = await getUserByEmail(credentials.email)
    if (!user) {
      res.status(STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED).json(
        APIResponse.sendError({
          message: MESSAGES.INVALID('email or password'),
        })
      )
      return
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(STATUS_CODES.CLIENT_ERROR.FORBIDDEN).json(
        APIResponse.sendError({
          message: MESSAGES.USER_ARCHIVED,
        })
      )
      return
    }

    // Verify password
    const isPasswordValid = await verifyPassword(
      credentials.password,
      user.password
    )
    if (!isPasswordValid) {
      res.status(STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED).json(
        APIResponse.sendError({
          message: MESSAGES.INVALID('email or password'),
        })
      )
      return
    }

    // Authenticate user
    const { tokens, user: authenticatedUser } = await authenticateUser(user)

    // Set authentication headers
    res.setHeader('x-access-token', tokens.accessToken)

    res.status(STATUS_CODES.SUCCESS.OK).json(
      APIResponse.sendSuccess({
        message: MESSAGES.RETRIEVE_SUCCESS('User'),
        data: {
          user: authenticatedUser,
          tokens,
        },
      })
    )
  }
)

/**
 * Logout a user
 * @param req Express request
 * @param res Express response
 * @param next Express next function
 */
// export const logout = catchAsync(
//   async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
//     if (!req.user?.userId) {
//       res.status(STATUS_CODES.CLIENT_ERROR.UNAUTHORIZED).json(
//         APIResponse.sendError({
//           message: MESSAGES.FORBIDDEN_MSG,
//         })
//       )
//       return
//     }

//     // Verify user exists
//     const user = await getUserById(req.user.userId)
//     if (!user) {
//       res.status(STATUS_CODES.CLIENT_ERROR.NOT_FOUND).json(
//         APIResponse.sendError({
//           message: MESSAGES.NOT_FOUND('User'),
//         })
//       )
//       return
//     }

//     await logoutUser(req.user.userId)

//     res.status(STATUS_CODES.SUCCESS.OK).json(
//       APIResponse.sendSuccess({
//         message: MESSAGES.LOG_OUT_SUCCESS,
//       })
//     )
//   }
// )
