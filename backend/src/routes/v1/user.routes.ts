import { Router } from 'express'
import { getUsers } from '../../controllers/user.controller'
import { verifyToken, requireRole } from '../../middlewares/auth.middleware'
import { validateQuery } from '../../middlewares/validations.middleware'
import { UserRole } from '@prisma/client'
import { PaginationParamsSchema, UserListQuerySchema } from '../../types'

const router = Router()

// Protected routes - Admin only
router.get(
  '/',
  verifyToken,
  requireRole([UserRole.ADMIN]),
  validateQuery(PaginationParamsSchema.merge(UserListQuerySchema)),
  getUsers
)

export default router
