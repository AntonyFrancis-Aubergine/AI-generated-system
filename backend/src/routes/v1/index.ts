import { Router } from 'express'
import healthRouter from './health.routes'
import authRouter from './auth.routes'

const v1Router = Router()

// Health check route
v1Router.use('/health', healthRouter)

// Authentication routes
v1Router.use('/auth', authRouter)

export default v1Router
