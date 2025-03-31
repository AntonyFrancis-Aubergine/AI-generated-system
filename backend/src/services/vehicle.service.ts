import { PrismaClient } from '@prisma/client'
import {
  ICreateVehicleRequest,
  IUpdateVehicleRequest,
  IGetVehiclesQuery,
  IVehicleResponseDTO,
} from '../types'
import { CONSTANTS } from '../utils/constants'

const prisma = new PrismaClient()

/**
 * Find a vehicle by registration number
 * @param registrationNumber The registration number to search for
 * @returns The vehicle or null if not found
 */
export const findVehicleByRegistrationNumber = async (
  registrationNumber: string
): Promise<IVehicleResponseDTO | null> => {
  const vehicle = await prisma.vehicle.findUnique({
    where: {
      registrationNumber,
    },
    include: {
      driverProfile: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              contactNumber: true,
            },
          },
        },
      },
    },
  })

  return vehicle as IVehicleResponseDTO | null
}

/**
 * Create a new vehicle
 * @param data The vehicle data
 * @returns The created vehicle
 */
export const createVehicle = async (
  data: ICreateVehicleRequest
): Promise<IVehicleResponseDTO> => {
  const vehicle = await prisma.vehicle.create({
    data,
    include: {
      driverProfile: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              contactNumber: true,
            },
          },
        },
      },
    },
  })

  return vehicle as IVehicleResponseDTO
}

/**
 * Get all vehicles with pagination and filters
 * @param query Query parameters for filtering and pagination
 * @returns List of vehicles and count
 */
export const getVehicles = async (
  query: IGetVehiclesQuery
): Promise<{ vehicles: IVehicleResponseDTO[]; count: number }> => {
  const {
    page = 1,
    limit = CONSTANTS.PAGINATION_LIMIT,
    make,
    model,
    status,
    isActive,
    isAssigned,
  } = query

  const skip = (page - 1) * Number(limit)

  // Build where condition for filtering
  const where: any = {}

  if (make) where.make = { contains: make, mode: 'insensitive' }
  if (model) where.model = { contains: model, mode: 'insensitive' }
  if (status) where.status = status
  if (isActive !== undefined) where.isActive = isActive === true

  if (isAssigned !== undefined) {
    where.driverProfile = isAssigned ? { isNot: null } : { is: null }
  }

  // Get vehicles with count
  const [vehicles, count] = await Promise.all([
    prisma.vehicle.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
      include: {
        driverProfile: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                contactNumber: true,
              },
            },
          },
        },
      },
    }),
    prisma.vehicle.count({ where }),
  ])

  return {
    vehicles: vehicles as IVehicleResponseDTO[],
    count,
  }
}

/**
 * Get a vehicle by ID
 * @param id The vehicle ID
 * @returns The vehicle or null if not found
 */
export const getVehicleById = async (
  id: string
): Promise<IVehicleResponseDTO | null> => {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id },
    include: {
      driverProfile: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              contactNumber: true,
            },
          },
        },
      },
    },
  })

  return vehicle as IVehicleResponseDTO | null
}

/**
 * Update a vehicle
 * @param id The vehicle ID
 * @param data The updated vehicle data
 * @returns The updated vehicle
 */
export const updateVehicle = async (
  id: string,
  data: IUpdateVehicleRequest
): Promise<IVehicleResponseDTO> => {
  const updatedVehicle = await prisma.vehicle.update({
    where: { id },
    data,
    include: {
      driverProfile: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              contactNumber: true,
            },
          },
        },
      },
    },
  })

  return updatedVehicle as IVehicleResponseDTO
}

/**
 * Delete a vehicle
 * @param id The vehicle ID
 */
export const deleteVehicle = async (id: string): Promise<void> => {
  await prisma.vehicle.delete({
    where: { id },
  })
}
