/**
 * Seed script to populate the database with initial data
 *
 * This script adds fitness class categories to the database
 * Run with: npm run seed (after adding the script to package.json)
 */

import prisma from '../config/db'

/**
 * Add fitness class categories to the database
 */
const seedCategories = async (): Promise<void> => {
  console.log('🌱 Seeding fitness class categories...')

  // Categories to seed
  const categories = [
    { name: 'Yoga-Session', description: 'Yoga classes for all levels' },
    { name: 'Gym', description: 'Strength and conditioning training' },
    { name: 'Zumba', description: 'Dance fitness program' },
  ]

  try {
    // Create categories
    for (const category of categories) {
      // Check if category already exists
      const existingCategory = await prisma.fitnessClassCategory.findUnique({
        where: { name: category.name },
      })

      if (existingCategory) {
        console.log(`Category '${category.name}' already exists, skipping...`)
        continue
      }

      // Create the category
      await prisma.fitnessClassCategory.create({
        data: category,
      })

      console.log(`✅ Category '${category.name}' created successfully`)
    }

    console.log('✨ Seeding completed!')
  } catch (error) {
    console.error('Error seeding categories:', error)
    throw error
  } finally {
    // Close the database connection
    await prisma.$disconnect()
  }
}

// Execute the seed function
seedCategories()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error('Error executing seed:', error)
    process.exit(1)
  })
