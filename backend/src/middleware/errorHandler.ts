import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { errorResponse } from '../utils/responseGenerator';

export class AppError extends Error {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler: ErrorRequestHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json(
      errorResponse(err.message)
    );
    return;
  }

  // Programming or other unknown error
  console.error('Error 💥', err);
  res.status(500).json(
    errorResponse('Something went wrong!', err.message)
  );
}; 