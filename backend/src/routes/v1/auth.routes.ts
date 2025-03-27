import { Router } from 'express'
import { createUser, login } from '../../controllers/auth.controller'
import { validate } from '../../middlewares/validations.middleware'
import { verifyToken, requireRole } from '../../middlewares/auth.middleware'
import { SignUpSchema, SignInSchema } from '../../types/auth.types'
import { UserRole } from '@prisma/client'

const router = Router()

// Public routes
router.post('/login', validate(SignInSchema), login)

// Protected routes - Admin only
router.post(
  '/users',
  verifyToken,
  requireRole([UserRole.ADMIN]),
  validate(SignUpSchema),
  createUser
)

export default router
