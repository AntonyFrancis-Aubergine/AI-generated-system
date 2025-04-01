import { Router } from 'express'
import { FitnessClassController } from '../../controllers'
import { authenticate } from '../../middlewares/auth.middleware'

const fitnessClassRouter = Router()

/**
 * @route GET /api/v1/fitness-classes
 * @desc Get available fitness classes with filtering and pagination
 * @access Authenticated users
 */
fitnessClassRouter.get(
  '/',
  authenticate,
  FitnessClassController.getAvailableFitnessClasses
)

export default fitnessClassRouter
