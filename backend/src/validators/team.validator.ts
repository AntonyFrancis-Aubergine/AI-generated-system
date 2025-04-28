import { body } from 'express-validator';
import { ROLES } from '../utils/constants';

export const createTeamValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Team name is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Team name must be between 3 and 50 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Team description is required')
    .isLength({ min: 10, max: 500 })
    .withMessage('Team description must be between 10 and 500 characters')
];

export const updateTeamValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Team name must be between 3 and 50 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Team description must be between 10 and 500 characters')
];

export const addTeamMemberValidation = [
  body('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isMongoId()
    .withMessage('Invalid user ID'),
  
  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .isIn(Object.values(ROLES))
    .withMessage('Invalid role')
]; 