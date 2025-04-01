import prisma from '../config/db'
import { Prisma, User } from '@prisma/client'
import { Pagination } from '../types'

export const fetchSingleUser = async (
  userQuery: Prisma.UserWhereInput
): Promise<User | null> => {
  const user = await prisma.user.findFirst({
    where: userQuery,
  })

  return user
}

export const fetchUsersWithFiltersAndPagination = async (
  userQuery: Prisma.UserWhereInput,
  pagination: Pagination
): Promise<User[]> => {
  const { page, limit } = pagination
  const skip = (page - 1) * limit

  const users = await prisma.user.findMany({
    where: userQuery,
    skip,
    take: limit,
  })

  return users
}
