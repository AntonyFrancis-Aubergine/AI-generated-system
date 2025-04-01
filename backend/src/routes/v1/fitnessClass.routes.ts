import { Router } from 'express'
import { FitnessClassController } from '../../controllers'
import { validate } from '../../middlewares/validations.middleware'
import { authenticate, hasRole } from '../../middlewares/auth.middleware'
import { FitnessClassSchema } from '../../schemas'
import { CONSTANTS } from '../../utils/constants'

const fitnessClassRouter = Router()

/**
 * @route GET /api/v1/fitness-classes
 * @desc Get all fitness classes with filtering and pagination
 * @access Restricted to ADMIN
 */
fitnessClassRouter.get(
  '/',
  authenticate,
  hasRole([CONSTANTS.AUTH.ROLES.ADMIN]),
  FitnessClassController.getAllFitnessClasses
)

/**
 * @route POST /api/v1/fitness-classes
 * @desc Create a new fitness class
 * @access Restricted to ADMIN
 */
fitnessClassRouter.post(
  '/',
  authenticate,
  hasRole([CONSTANTS.AUTH.ROLES.ADMIN]),
  validate(FitnessClassSchema.createFitnessClassSchema),
  FitnessClassController.createFitnessClass
)

export default fitnessClassRouter
