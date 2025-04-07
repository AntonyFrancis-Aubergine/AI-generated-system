import { Router } from 'express'
import { InstructorController } from '../../controllers'
import { authenticate, hasRole } from '../../middlewares/auth.middleware'
import { CONSTANTS } from '../../utils/constants'

const instructorRouter = Router()

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
