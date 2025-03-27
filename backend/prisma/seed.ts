import { UserRole } from '@prisma/client'
import bcrypt from 'bcrypt'
import { CONSTANTS } from '../src/utils/constants'
import { prisma } from '../src/config/db'

async function main() {
  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@example.com' },
  })

  if (!existingAdmin) {
    // Create admin user
    const hashedPassword = await bcrypt.hash(
      'Admin@123',
      CONSTANTS.AUTH.PASSWORD_SALT_ROUNDS
    )

    const admin = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: hashedPassword,
        name: 'System Admin',
        role: UserRole.ADMIN,
        isActive: true,
      },
    })

    console.log('Admin user created successfully:', admin.email)
  } else {
    console.log('Admin user already exists, skipping creation')
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
