import { Router } from 'express'
import healthRouter from './health.routes'

const v1Router = Router()

// Health check route
v1Router.use('/health', healthRouter)

export default v1Router
