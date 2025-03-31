import { Router } from 'express'
import authRoutes from './auth.routes'
import userRoutes from './user.routes'
import adminRoutes from './admin.routes'
import driverRoutes from './driver.routes'
import { verifyToken } from '../../middlewares/auth.middleware'

const router = Router()

// Public routes
router.use('/auth', authRoutes)

// Protected routes
router.use(verifyToken)
router.use('/users', userRoutes)
router.use('/admin', adminRoutes)
router.use('/driver', driverRoutes)

export default router
