import express, { Express } from 'express'
import routes from './routes'
import { errorConverter, errorHandler } from './middlewares/error.middleware'
import { prisma } from './config/db'

// Initialize app
const app: Express = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// API Routes
app.use(routes)

// Error handling middleware
app.use(errorConverter)
app.use(errorHandler)

// Only start the server if this file is run directly (not when imported in tests)
if (process.env.NODE_ENV !== 'test') {
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
}

export default app
