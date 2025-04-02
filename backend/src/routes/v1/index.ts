import { Router } from 'express'
import healthRouter from './health.routes'
import authRouter from './auth.routes'
import fitnessClassRouter from './fitnessClass.routes'
import bookingRouter from './booking.routes'

const v1Router = Router()

// Health check route
v1Router.use('/health', healthRouter)

// Authentication routes
v1Router.use('/auth', authRouter)

// Fitness class routes
v1Router.use('/fitness-classes', fitnessClassRouter)

// Booking routes
v1Router.use('/bookings', bookingRouter)

export default v1Router
