import { Request, Response, NextFunction } from 'express';
import Role from '../models/role.model';
import { AppError } from '../utils/errorHandler';
import { AUTH_MESSAGES } from '../utils/messages';

export const checkPermission = (requiredPermission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new AppError(AUTH_MESSAGES.UNAUTHORIZED, 401);
      }

      const role = await Role.findById(req.user.role);
      if (!role) {
        throw new AppError(AUTH_MESSAGES.INVALID_ROLE, 403);
      }

      if (!role.permissions.includes(requiredPermission)) {
        throw new AppError(AUTH_MESSAGES.INSUFFICIENT_PERMISSIONS, 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}; 