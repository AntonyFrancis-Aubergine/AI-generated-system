import { Request, Response, NextFunction } from 'express'
import { APIError } from '../utils/customError'
import { MESSAGES } from '../utils/messages'
import { STATUS_CODES } from '../utils/statusCodes'
import { errorResponse } from '../utils/responseGenerator'

export const errorConverter = (
  error: any,
  _req: Request,
  _res: Response,
  next: NextFunction
): void => {
  let err: APIError

  // TODO: Add more cases as needed
  switch (true) {
    case error.isOperational:
      err = error
      break
    // case error instanceof ValidationError:
    //   err = new APIError(
    //     statusCodes.CLIENT_ERROR.BAD_REQUEST,
    //     MESSAGES.VALIDATION_ERR,
    //     false,
    //     error
    //   );
    //   break;
    // case error instanceof TokenExpiredError:
    //   err = new APIError(
    //     statusCodes.CLIENT_ERROR.UNAUTHORIZED,
    //     MESSAGES.TOKEN_EXPIRED,
    //     false,
    //     error.stack
    //   );
    //   break;
    // case error instanceof JsonWebTokenError:
    //   err = new APIError(
    //     statusCodes.CLIENT_ERROR.UNAUTHORIZED,
    //     MESSAGES.INVALID('Token'),
    //     false,
    //     error.stack
    //   );
    //   break;
    // case error instanceof Sequelize.Error:
    //   err = new APIError(
    //     statusCodes.CLIENT_ERROR.BAD_REQUEST,
    //     MESSAGES.DATABASE_ERROR,
    //     false,
    //     error
    //   );
    //   break;
    default:
      err = new APIError(
        STATUS_CODES.SERVER_ERROR.INTERNAL_SERVER_ERROR,
        MESSAGES.ERROR,
        false,
        error
      )
      break
  }
  next(err)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (
  error: APIError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(JSON.stringify(error, null, 2))

  // if (error.message === MESSAGES.TOKEN_EXPIRED) {
  //   return res.status(error.status).json(
  //     APIResponse.sendError({
  //       message: error.message,
  //       data: { expired: true },
  //     })
  //   );
  // } else if (error.message === MESSAGES.VALIDATION_ERR) {
  //   return res.status(error.status).json(
  //     APIResponse.sendError({
  //       message: error.message,
  //       extra: error.initialError,
  //     })
  //   );
  // }

  res
    .status(error.status)
    .json(errorResponse(error.message))

  return
}
