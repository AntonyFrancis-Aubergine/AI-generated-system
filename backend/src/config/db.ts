import { PrismaClient } from '@prisma/client'

// Initialize Prisma client
const prisma = new PrismaClient()

// Export the Prisma client instance for use throughout the application
export { prisma }

// Handle application shutdown and cleanup
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})
