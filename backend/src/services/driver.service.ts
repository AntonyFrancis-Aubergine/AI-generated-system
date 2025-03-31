import { PrismaClient, UserRole } from '@prisma/client'
import {
  ICreateDriverProfileRequest,
  IUpdateDriverProfileRequest,
  IGetDriverProfilesQuery,
  IDriverProfileResponseDTO,
} from '../types'
import { CONSTANTS } from '../utils/constants'

const prisma = new PrismaClient()

/**
 * Find a driver profile by user ID
 * @param userId User ID
 * @returns Driver profile or null if not found
 */
export const findDriverProfileByUserId = async (
  userId: string
): Promise<IDriverProfileResponseDTO | null> => {
  // Replace raw query with Prisma ORM call
  const driverProfile = await prisma.driverProfile.findUnique({
    where: { userId },
    include: {
      user: true,
      vehicle: true,
    },
  })

  if (!driverProfile) {
    return null
  }

  // Transform result to expected DTO format
  return {
    id: driverProfile.id,
    licenseNumber: driverProfile.licenseNumber,
    licenseExpiry: driverProfile.licenseExpiry,
    experienceYears: driverProfile.experienceYears,
    rating: driverProfile.rating,
    isAvailable: driverProfile.isAvailable,
    isActive: driverProfile.isActive,
    userId: driverProfile.userId,
    vehicleId: driverProfile.vehicleId,
    createdAt: driverProfile.createdAt,
    updatedAt: driverProfile.updatedAt,
    user: {
      id: driverProfile.user.id,
      name: driverProfile.user.name,
      email: driverProfile.user.email,
      contactNumber: driverProfile.user.contactNumber,
      profileImageUrl: driverProfile.user.profileImageUrl,
    },
    vehicle: driverProfile.vehicle
      ? {
          id: driverProfile.vehicle.id,
          registrationNumber: driverProfile.vehicle.registrationNumber,
          model: driverProfile.vehicle.model,
          make: driverProfile.vehicle.make,
          color: driverProfile.vehicle.color,
        }
      : null,
  } as IDriverProfileResponseDTO
}

/**
 * Find a driver profile by license number
 * @param licenseNumber License number
 * @returns Driver profile or null if not found
 */
export const findDriverProfileByLicenseNumber = async (
  licenseNumber: string
): Promise<IDriverProfileResponseDTO | null> => {
  // Replace raw query with Prisma ORM call
  const driverProfile = await prisma.driverProfile.findUnique({
    where: { licenseNumber },
    include: {
      user: true,
      vehicle: true,
    },
  })

  if (!driverProfile) {
    return null
  }

  // Transform result to expected DTO format
  return {
    id: driverProfile.id,
    licenseNumber: driverProfile.licenseNumber,
    licenseExpiry: driverProfile.licenseExpiry,
    experienceYears: driverProfile.experienceYears,
    rating: driverProfile.rating,
    isAvailable: driverProfile.isAvailable,
    isActive: driverProfile.isActive,
    userId: driverProfile.userId,
    vehicleId: driverProfile.vehicleId,
    createdAt: driverProfile.createdAt,
    updatedAt: driverProfile.updatedAt,
    user: {
      id: driverProfile.user.id,
      name: driverProfile.user.name,
      email: driverProfile.user.email,
      contactNumber: driverProfile.user.contactNumber,
      profileImageUrl: driverProfile.user.profileImageUrl,
    },
    vehicle: driverProfile.vehicle
      ? {
          id: driverProfile.vehicle.id,
          registrationNumber: driverProfile.vehicle.registrationNumber,
          model: driverProfile.vehicle.model,
          make: driverProfile.vehicle.make,
          color: driverProfile.vehicle.color,
        }
      : null,
  } as IDriverProfileResponseDTO
}

/**
 * Create a new driver profile
 * @param data Driver profile data
 * @returns Created driver profile
 */
export const createDriverProfile = async (
  data: ICreateDriverProfileRequest
): Promise<IDriverProfileResponseDTO> => {
  try {
    // Update user role to DRIVER
    await prisma.user.update({
      where: { id: data.userId },
      data: { role: UserRole.DRIVER },
    })

    // Create driver profile using Prisma ORM
    const createdDriverProfile = await prisma.driverProfile.create({
      data: {
        licenseNumber: data.licenseNumber,
        licenseExpiry: new Date(data.licenseExpiry),
        experienceYears: data.experienceYears || 0,
        isAvailable: data.isAvailable === undefined ? true : data.isAvailable,
        userId: data.userId,
      },
      include: {
        user: true,
        vehicle: true,
      },
    })

    // Transform result to expected DTO format
    return {
      id: createdDriverProfile.id,
      licenseNumber: createdDriverProfile.licenseNumber,
      licenseExpiry: createdDriverProfile.licenseExpiry,
      experienceYears: createdDriverProfile.experienceYears,
      rating: createdDriverProfile.rating,
      isAvailable: createdDriverProfile.isAvailable,
      isActive: createdDriverProfile.isActive,
      userId: createdDriverProfile.userId,
      vehicleId: createdDriverProfile.vehicleId,
      createdAt: createdDriverProfile.createdAt,
      updatedAt: createdDriverProfile.updatedAt,
      user: {
        id: createdDriverProfile.user.id,
        name: createdDriverProfile.user.name,
        email: createdDriverProfile.user.email,
        contactNumber: createdDriverProfile.user.contactNumber,
        profileImageUrl: createdDriverProfile.user.profileImageUrl,
      },
      vehicle: createdDriverProfile.vehicle
        ? {
            id: createdDriverProfile.vehicle.id,
            registrationNumber: createdDriverProfile.vehicle.registrationNumber,
            model: createdDriverProfile.vehicle.model,
            make: createdDriverProfile.vehicle.make,
            color: createdDriverProfile.vehicle.color,
          }
        : null,
    } as IDriverProfileResponseDTO
  } catch (error) {
    console.error('Error creating driver profile:', error)
    throw error
  }
}

/**
 * Get all driver profiles with pagination and filters
 * @param query Query parameters for filtering and pagination
 * @returns List of driver profiles and count
 */
export const getDriverProfiles = async (
  query: IGetDriverProfilesQuery
): Promise<{ drivers: IDriverProfileResponseDTO[]; count: number }> => {
  const {
    page = 1,
    limit = CONSTANTS.PAGINATION_LIMIT,
    isAvailable,
    isActive,
    hasVehicle,
    minExperience,
    minRating,
  } = query

  const skip = (page - 1) * Number(limit)

  // Build where conditions for Prisma query
  const where: any = {}

  if (isAvailable !== undefined) {
    where.isAvailable = isAvailable === true
  }

  if (isActive !== undefined) {
    where.isActive = isActive === true
  }

  if (minExperience !== undefined) {
    where.experienceYears = {
      gte: Number(minExperience),
    }
  }

  if (minRating !== undefined) {
    where.rating = {
      gte: Number(minRating),
    }
  }

  if (hasVehicle !== undefined) {
    where.vehicleId = hasVehicle ? { not: null } : null
  }

  // Get count using Prisma
  const count = await prisma.driverProfile.count({ where })

  // Get drivers with pagination using Prisma
  const driverProfiles = await prisma.driverProfile.findMany({
    where,
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      user: true,
      vehicle: true,
    },
    skip,
    take: Number(limit),
  })

  // Transform results to expected DTO format
  const drivers = driverProfiles.map((profile) => ({
    id: profile.id,
    licenseNumber: profile.licenseNumber,
    licenseExpiry: profile.licenseExpiry,
    experienceYears: profile.experienceYears,
    rating: profile.rating,
    isAvailable: profile.isAvailable,
    isActive: profile.isActive,
    userId: profile.userId,
    vehicleId: profile.vehicleId,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
    user: {
      id: profile.user.id,
      name: profile.user.name,
      email: profile.user.email,
      contactNumber: profile.user.contactNumber,
      profileImageUrl: profile.user.profileImageUrl,
    },
    vehicle: profile.vehicle
      ? {
          id: profile.vehicle.id,
          registrationNumber: profile.vehicle.registrationNumber,
          model: profile.vehicle.model,
          make: profile.vehicle.make,
          color: profile.vehicle.color,
        }
      : null,
  })) as IDriverProfileResponseDTO[]

  return {
    drivers,
    count,
  }
}

/**
 * Get a driver profile by ID
 * @param id Driver profile ID
 * @returns Driver profile or null if not found
 */
export const getDriverProfileById = async (
  id: string
): Promise<IDriverProfileResponseDTO | null> => {
  // Replace raw query with Prisma ORM call
  const driverProfile = await prisma.driverProfile.findUnique({
    where: { id },
    include: {
      user: true,
      vehicle: true,
    },
  })

  if (!driverProfile) {
    return null
  }

  // Transform result to expected DTO format
  return {
    id: driverProfile.id,
    licenseNumber: driverProfile.licenseNumber,
    licenseExpiry: driverProfile.licenseExpiry,
    experienceYears: driverProfile.experienceYears,
    rating: driverProfile.rating,
    isAvailable: driverProfile.isAvailable,
    isActive: driverProfile.isActive,
    userId: driverProfile.userId,
    vehicleId: driverProfile.vehicleId,
    createdAt: driverProfile.createdAt,
    updatedAt: driverProfile.updatedAt,
    user: {
      id: driverProfile.user.id,
      name: driverProfile.user.name,
      email: driverProfile.user.email,
      contactNumber: driverProfile.user.contactNumber,
      profileImageUrl: driverProfile.user.profileImageUrl,
    },
    vehicle: driverProfile.vehicle
      ? {
          id: driverProfile.vehicle.id,
          registrationNumber: driverProfile.vehicle.registrationNumber,
          model: driverProfile.vehicle.model,
          make: driverProfile.vehicle.make,
          color: driverProfile.vehicle.color,
        }
      : null,
  } as IDriverProfileResponseDTO
}

/**
 * Update a driver profile
 * @param id Driver profile ID
 * @param data Updated driver profile data
 * @returns Updated driver profile
 */
export const updateDriverProfile = async (
  id: string,
  data: IUpdateDriverProfileRequest
): Promise<IDriverProfileResponseDTO> => {
  try {
    // Build updateData object for Prisma
    const updateData: any = {}

    if (data.licenseNumber !== undefined) {
      updateData.licenseNumber = data.licenseNumber
    }

    if (data.licenseExpiry !== undefined) {
      updateData.licenseExpiry = new Date(data.licenseExpiry)
    }

    if (data.experienceYears !== undefined) {
      updateData.experienceYears = data.experienceYears
    }

    if (data.rating !== undefined) {
      updateData.rating = data.rating
    }

    if (data.isAvailable !== undefined) {
      updateData.isAvailable = data.isAvailable
    }

    if (data.isActive !== undefined) {
      updateData.isActive = data.isActive
    }

    // Update driver profile using Prisma
    const updatedDriverProfile = await prisma.driverProfile.update({
      where: { id },
      data: updateData,
      include: {
        user: true,
        vehicle: true,
      },
    })

    // Transform result to expected DTO format
    return {
      id: updatedDriverProfile.id,
      licenseNumber: updatedDriverProfile.licenseNumber,
      licenseExpiry: updatedDriverProfile.licenseExpiry,
      experienceYears: updatedDriverProfile.experienceYears,
      rating: updatedDriverProfile.rating,
      isAvailable: updatedDriverProfile.isAvailable,
      isActive: updatedDriverProfile.isActive,
      userId: updatedDriverProfile.userId,
      vehicleId: updatedDriverProfile.vehicleId,
      createdAt: updatedDriverProfile.createdAt,
      updatedAt: updatedDriverProfile.updatedAt,
      user: {
        id: updatedDriverProfile.user.id,
        name: updatedDriverProfile.user.name,
        email: updatedDriverProfile.user.email,
        contactNumber: updatedDriverProfile.user.contactNumber,
        profileImageUrl: updatedDriverProfile.user.profileImageUrl,
      },
      vehicle: updatedDriverProfile.vehicle
        ? {
            id: updatedDriverProfile.vehicle.id,
            registrationNumber: updatedDriverProfile.vehicle.registrationNumber,
            model: updatedDriverProfile.vehicle.model,
            make: updatedDriverProfile.vehicle.make,
            color: updatedDriverProfile.vehicle.color,
          }
        : null,
    } as IDriverProfileResponseDTO
  } catch (error) {
    console.error('Error updating driver profile:', error)
    throw error
  }
}

/**
 * Assign a vehicle to a driver
 * @param driverId Driver profile ID
 * @param vehicleId Vehicle ID
 * @returns Updated driver profile
 */
export const assignVehicleToDriver = async (
  driverId: string,
  vehicleId: string
): Promise<IDriverProfileResponseDTO> => {
  try {
    // Update driver profile with vehicle ID using Prisma
    const updatedDriverProfile = await prisma.driverProfile.update({
      where: { id: driverId },
      data: { vehicleId },
      include: {
        user: true,
        vehicle: true,
      },
    })

    // Transform result to expected DTO format
    return {
      id: updatedDriverProfile.id,
      licenseNumber: updatedDriverProfile.licenseNumber,
      licenseExpiry: updatedDriverProfile.licenseExpiry,
      experienceYears: updatedDriverProfile.experienceYears,
      rating: updatedDriverProfile.rating,
      isAvailable: updatedDriverProfile.isAvailable,
      isActive: updatedDriverProfile.isActive,
      userId: updatedDriverProfile.userId,
      vehicleId: updatedDriverProfile.vehicleId,
      createdAt: updatedDriverProfile.createdAt,
      updatedAt: updatedDriverProfile.updatedAt,
      user: {
        id: updatedDriverProfile.user.id,
        name: updatedDriverProfile.user.name,
        email: updatedDriverProfile.user.email,
        contactNumber: updatedDriverProfile.user.contactNumber,
        profileImageUrl: updatedDriverProfile.user.profileImageUrl,
      },
      vehicle: updatedDriverProfile.vehicle
        ? {
            id: updatedDriverProfile.vehicle.id,
            registrationNumber: updatedDriverProfile.vehicle.registrationNumber,
            model: updatedDriverProfile.vehicle.model,
            make: updatedDriverProfile.vehicle.make,
            color: updatedDriverProfile.vehicle.color,
          }
        : null,
    } as IDriverProfileResponseDTO
  } catch (error) {
    console.error('Error assigning vehicle to driver:', error)
    throw error
  }
}

/**
 * Unassign a vehicle from a driver
 * @param driverId Driver profile ID
 * @returns Updated driver profile
 */
export const unassignVehicleFromDriver = async (
  driverId: string
): Promise<IDriverProfileResponseDTO> => {
  try {
    // Update driver profile to remove vehicle ID using Prisma
    const updatedDriverProfile = await prisma.driverProfile.update({
      where: { id: driverId },
      data: { vehicleId: null },
      include: {
        user: true,
        vehicle: true,
      },
    })

    // Transform result to expected DTO format
    return {
      id: updatedDriverProfile.id,
      licenseNumber: updatedDriverProfile.licenseNumber,
      licenseExpiry: updatedDriverProfile.licenseExpiry,
      experienceYears: updatedDriverProfile.experienceYears,
      rating: updatedDriverProfile.rating,
      isAvailable: updatedDriverProfile.isAvailable,
      isActive: updatedDriverProfile.isActive,
      userId: updatedDriverProfile.userId,
      vehicleId: updatedDriverProfile.vehicleId,
      createdAt: updatedDriverProfile.createdAt,
      updatedAt: updatedDriverProfile.updatedAt,
      user: {
        id: updatedDriverProfile.user.id,
        name: updatedDriverProfile.user.name,
        email: updatedDriverProfile.user.email,
        contactNumber: updatedDriverProfile.user.contactNumber,
        profileImageUrl: updatedDriverProfile.user.profileImageUrl,
      },
      vehicle: null,
    } as IDriverProfileResponseDTO
  } catch (error) {
    console.error('Error unassigning vehicle from driver:', error)
    throw error
  }
}
