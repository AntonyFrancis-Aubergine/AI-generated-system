import { Router } from 'express'
import { UserController } from '../../controllers'
import { authenticate, isSelfOrAdmin } from '../../middlewares/auth.middleware'

const userRouter = Router()

/**
 * @route GET /api/v1/users/:userId
 * @desc Get a user by ID
 * @access Authenticated users (admin or the user themselves)
 */
userRouter.get(
  '/:userId',
  authenticate,
  isSelfOrAdmin,
  UserController.getUserById
)

export default userRouter
