import { Router } from 'express'
import { InstructorController } from '../../controllers'
import { authenticate, hasRole } from '../../middlewares/auth.middleware'
import { CONSTANTS } from '../../utils/constants'

const instructorRouter = Router()

/**
 * @route GET /api/v1/instructors
 * @desc Get all instructors with pagination and optional name search
 * @access Authenticated users
 */
instructorRouter.get('/', authenticate, InstructorController.getAllInstructors)

/**
 * @route GET /api/v1/instructors/classes
 * @desc Get all classes for which the authenticated user is an instructor
 * @access Authenticated instructors only
 */
instructorRouter.get(
  '/classes',
  authenticate,
  hasRole([CONSTANTS.AUTH.ROLES.INSTRUCTOR]),
  InstructorController.getInstructorClasses
)

export default instructorRouter
