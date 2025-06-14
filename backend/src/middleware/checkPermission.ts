import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { AppError } from '../utils/errorHandler';
import { AUTH_MESSAGES } from '../utils/messages';
import { Role } from '../models/role.model';

interface RequestWithUser extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const checkPermission = (requiredPermission: string) => {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const roleId = req.user?.role;
      if (!roleId) {
        throw new AppError(AUTH_MESSAGES.UNAUTHORIZED, 403);
      }

      const role = await Role.findById(roleId);
      if (!role) {
        throw new AppError(AUTH_MESSAGES.INVALID_ROLE, 403);
      }

      const permissionObjectId = new Types.ObjectId(requiredPermission);
      if (!role.permissions.includes(permissionObjectId)) {
        throw new AppError(AUTH_MESSAGES.INSUFFICIENT_PERMISSIONS, 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}; 