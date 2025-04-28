import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errorHandler';
import { AnySchema } from 'joi';

export const validate = (schema: AnySchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      next(new AppError(errorMessage, 400));
    } else {
      next();
    }
  };
}; 