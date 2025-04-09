import { Router } from 'express'
import healthRouter from './health.routes'
import authRouter from './auth.routes'
import fitnessClassRouter from './fitnessClass.routes'
import bookingRouter from './booking.routes'
import categoryRouter from './category.routes'
import userRouter from './user.routes'
import instructorRouter from './instructor.routes'
import friendshipRouter from './friendship.routes'
import reviewRouter from './review.routes'

const v1Router = Router()

// Health check route
v1Router.use('/health', healthRouter)

// Authentication routes
v1Router.use('/auth', authRouter)

// Fitness class routes
v1Router.use('/fitness-classes', fitnessClassRouter)

// Booking routes
v1Router.use('/bookings', bookingRouter)

// Category routes
v1Router.use('/categories', categoryRouter)

// User routes
v1Router.use('/users', userRouter)

// Instructor routes
v1Router.use('/instructors', instructorRouter)

// Friendship routes
v1Router.use('/friendships', friendshipRouter)

// Review routes
v1Router.use('/reviews', reviewRouter)

export default v1Router
