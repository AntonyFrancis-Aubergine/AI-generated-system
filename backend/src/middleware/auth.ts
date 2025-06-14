import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/errorHandler';
import { Role } from '../models/role.model';

interface JwtPayload {
  userId: string;
  role: string;
}

interface RequestWithUser extends Request {
  user?: { 
    id: string; 
    role: string;
  };
}

export const authenticate = async (req: RequestWithUser, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new AppError('Authentication required', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = { 
      id: decoded.userId, 
      role: decoded.role
    };
    next();
  } catch (error) {
    next(new AppError('Invalid token', 401));
  }
}; 