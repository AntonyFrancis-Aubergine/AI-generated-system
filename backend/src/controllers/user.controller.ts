import { Request, Response, NextFunction } from 'express'
import { listUsers } from '../services/user.service'
import { STATUS_CODES } from '../utils/statusCodes'
import { MESSAGES } from '../utils/messages'
import { APIResponse } from '../utils/responseGenerator'
import { catchAsync } from '../utils/wrapper'
import { UserListQueryParams } from '../types/user.types'
import { PaginationParams } from '../types/common.types'
import { formatPaginatedResponse } from '../utils/pagination'

/**
 * List users with pagination and filters (Admin only)
 * @param req Express request
 * @param res Express response
 * @param next Express next function
 */
export const getUsers = catchAsync(
  async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    // Parse query parameters
    const queryParams: UserListQueryParams = {
      name: req.query.name as string | undefined,
      email: req.query.email as string | undefined,
      role: req.query.role as any,
      isActive:
        req.query.isActive === 'true'
          ? true
          : req.query.isActive === 'false'
          ? false
          : undefined,
    }

    // Parse pagination parameters
    const paginationParams: PaginationParams = {
      page: req.query.page ? parseInt(req.query.page as string, 10) : 1,
      limit: req.query.limit
        ? parseInt(req.query.limit as string, 10)
        : undefined,
    }

    // Get users with pagination and filters
    const paginatedUsers = await listUsers(queryParams, paginationParams)

    // Format the response using the utility function
    const formattedResponse = formatPaginatedResponse(paginatedUsers)

    res.status(STATUS_CODES.SUCCESS.OK).json(
      APIResponse.sendSuccess({
        message: MESSAGES.RETRIEVE_SUCCESS('Users'),
        data: formattedResponse.data,
        extra: { pagination: formattedResponse.pagination },
      })
    )
  }
)
