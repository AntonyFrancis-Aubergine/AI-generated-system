import express from 'express'
import { errorConverter, errorHandler } from './middlewares/error.middleware'
import v1Router from './routes'

// Initialize express app
const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// API Routes
app.use('/api', v1Router)

// Error handling middleware
app.use(errorConverter)
app.use(errorHandler)

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app
