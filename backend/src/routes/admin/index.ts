import { Router } from 'express'
import fitnessClassRouter from './fitnessClass.routes'
import { authenticate, hasRole } from '../../middlewares/auth.middleware'
import { CONSTANTS } from '../../utils/constants'

const adminRouter = Router()

// Apply admin role check middleware to all admin routes
adminRouter.use(authenticate, hasRole([CONSTANTS.AUTH.ROLES.ADMIN]))

// Fitness class admin routes
adminRouter.use('/fitness-classes', fitnessClassRouter)

export default adminRouter
