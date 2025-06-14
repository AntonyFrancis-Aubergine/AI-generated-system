import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { register, login } from '../services/auth.service.js';
import { successResponse, errorResponse } from '../utils/responseGenerator.js';
import { ROLES } from '../utils/constants.js';
import { AppError } from '../utils/errorHandler.js';

export const registerValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  body('name').notEmpty().withMessage('Name is required'),
  body('role').isIn(Object.values(ROLES)).withMessage('Invalid role')
];

export const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(errors.array()[0].msg, 400);
    }

    const result = await register(req.body);
    res.status(201).json(successResponse(result, 'User registered successfully'));
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(errors.array()[0].msg, 400);
    }

    const result = await login(req.body);
    res.status(200).json(successResponse(result, 'Login successful'));
  } catch (error) {
    next(error);
  }
}; 