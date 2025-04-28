import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User } from '../models';
import { AppError } from './errorHandler';
import { AUTH_MESSAGES } from '../utils/messages';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(AUTH_MESSAGES.UNAUTHORIZED, 401);
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
      role: string;
    };

    // Check if user still exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new AppError(AUTH_MESSAGES.UNAUTHORIZED, 401);
    }

    // Add user to request
    req.user = {
      id: decoded.userId,
      role: decoded.role
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError(AUTH_MESSAGES.TOKEN_INVALID, 401));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new AppError(AUTH_MESSAGES.TOKEN_EXPIRED, 401));
    } else {
      next(error);
    }
  }
}; 