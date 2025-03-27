import express, { Express } from 'express'
import { PrismaClient } from '@prisma/client'
import routes from './routes'
import { errorConverter, errorHandler } from './middlewares/error.middleware'

// Initialize app
const app: Express = express()
const PORT = process.env.PORT || 3000

// Initialize Prisma client
const prisma = new PrismaClient()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// API Routes
app.use(routes)

// Error handling middleware
app.use(errorConverter)
app.use(errorHandler)

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`)
})

// Handle server shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server')
  server.close(async () => {
    await prisma.$disconnect()
    console.log('HTTP server closed')
    process.exit(0)
  })
})

export default app
