import prisma from '../config/db'
import { Prisma, FitnessClass } from '@prisma/client'
import { Pagination, PaginatedResult } from '../types'

export const fetchFitnessClass = async (
  fitnessClassQuery: Prisma.FitnessClassWhereInput
): Promise<FitnessClass | null> => {
  const fitnessClass = await prisma.fitnessClass.findFirst({
    where: fitnessClassQuery,
    include: {
      category: true,
      instructor: true,
      bookings: true,
    },
  })

  return fitnessClass
}

export const fetchFitnessClassesWithFiltersAndPagination = async (
  fitnessClassQuery: Prisma.FitnessClassWhereInput,
  pagination: Pagination
): Promise<PaginatedResult<FitnessClass>> => {
  const { page, limit } = pagination
  const skip = (page - 1) * limit

  // Get total count for pagination metadata
  const totalItems = await prisma.fitnessClass.count({
    where: fitnessClassQuery,
  })

  const fitnessClasses = await prisma.fitnessClass.findMany({
    where: fitnessClassQuery,
    skip,
    take: limit,
    include: {
      category: true,
      instructor: true,
      bookings: true,
    },
  })

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalItems / limit)
  const hasNextPage = page < totalPages
  const hasPreviousPage = page > 1

  return {
    data: fitnessClasses,
    meta: {
      currentPage: page,
      totalPages,
      totalItems,
      itemsPerPage: limit,
      hasNextPage,
      hasPreviousPage,
    },
  }
}

export const createFitnessClass = async (
  fitnessClassData: Prisma.FitnessClassCreateInput
): Promise<FitnessClass> => {
  const fitnessClass = await prisma.fitnessClass.create({
    data: fitnessClassData,
    include: {
      category: true,
      instructor: true,
    },
  })

  return fitnessClass
}

export const updateFitnessClass = async (
  fitnessClassId: string,
  fitnessClassData: Prisma.FitnessClassUpdateInput
): Promise<FitnessClass> => {
  const fitnessClass = await prisma.fitnessClass.update({
    where: { id: fitnessClassId },
    data: fitnessClassData,
    include: {
      category: true,
      instructor: true,
      bookings: true,
    },
  })

  return fitnessClass
}

export const deleteFitnessClass = async (
  fitnessClassId: string
): Promise<void> => {
  await prisma.fitnessClass.delete({
    where: { id: fitnessClassId },
  })
}
