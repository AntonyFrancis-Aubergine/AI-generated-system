import prisma from '../config/db'
import { Prisma, FitnessClass } from '@prisma/client'
import { Pagination } from '../types'

export const fetchFitnessClass = async (
  fitnessClassQuery: Prisma.FitnessClassWhereInput
): Promise<FitnessClass | null> => {
  const fitnessClass = await prisma.fitnessClass.findFirst({
    where: fitnessClassQuery,
  })

  return fitnessClass
}

export const fetchFitnessClassesWithFiltersAndPagination = async (
  fitnessClassQuery: Prisma.FitnessClassWhereInput,
  pagination: Pagination
): Promise<FitnessClass[]> => {
  const { page, limit } = pagination
  const skip = (page - 1) * limit

  const fitnessClasses = await prisma.fitnessClass.findMany({
    where: fitnessClassQuery,
    skip,
    take: limit,
    include: {
      category: true,
      instructor: true,
    },
  })

  return fitnessClasses
}

export const createFitnessClass = async (
  fitnessClassData: Prisma.FitnessClassCreateInput
): Promise<FitnessClass> => {
  const fitnessClass = await prisma.fitnessClass.create({
    data: fitnessClassData,
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
