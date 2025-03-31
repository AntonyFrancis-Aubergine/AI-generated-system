import { Request, Response, NextFunction } from 'express'
import { APIResponse } from '../utils/responseGenerator'
import { MESSAGES } from '../utils/messages'
import * as driverService from '../services/driver.service'
import * as userService from '../services/user.service'
import * as vehicleService from '../services/vehicle.service'
import {
  ICreateDriverProfileRequest,
  IUpdateDriverProfileRequest,
  IGetDriverProfilesQuery,
} from '../types'
import { STATUS_CODES } from '../utils/statusCodes'
import { z } from 'zod'
import {
  createDriverProfileSchema,
  updateDriverProfileSchema,
  getDriverProfilesQuerySchema,
  assignVehicleSchema,
} from '../schemas'

// Helper type to extract the inferred type from Zod schema
type InferredCreateDriverProfileRequest = z.infer<
  typeof createDriverProfileSchema
>
type InferredUpdateDriverProfileRequest = z.infer<
  typeof updateDriverProfileSchema
>
type InferredGetDriverProfilesQuery = z.infer<
  typeof getDriverProfilesQuerySchema
>
type InferredAssignVehicleRequest = z.infer<typeof assignVehicleSchema>

/**
 * Create a new driver profile
 * @route POST /api/v1/admin/drivers
 * @access Admin
 */
export const createDriverProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // The request body is already validated by the middleware
    const driverData: InferredCreateDriverProfileRequest = req.body

    // Check if user exists
    const user = await userService.getUserById(driverData.userId)
    if (!user) {
      res.status(STATUS_CODES.CLIENT_ERROR.NOT_FOUND).json(
        APIResponse.sendError({
          message: MESSAGES.NOT_FOUND('User'),
        })
      )
      return
    }

    // Check if user already has a driver profile
    const existingDriverProfile = await driverService.findDriverProfileByUserId(
      driverData.userId
    )
    if (existingDriverProfile) {
      res.status(STATUS_CODES.CLIENT_ERROR.CONFLICT).json(
        APIResponse.sendError({
          message: MESSAGES.EXISTS('Driver profile for this user'),
        })
      )
      return
    }

    // Check if license number is unique
    const driverWithSameLicense =
      await driverService.findDriverProfileByLicenseNumber(
        driverData.licenseNumber
      )
    if (driverWithSameLicense) {
      res.status(STATUS_CODES.CLIENT_ERROR.CONFLICT).json(
        APIResponse.sendError({
          message: MESSAGES.EXISTS('Driver with this license number'),
        })
      )
      return
    }

    const driver = await driverService.createDriverProfile(
      driverData as ICreateDriverProfileRequest
    )

    res.status(STATUS_CODES.SUCCESS.CREATED).json(
      APIResponse.sendSuccess({
        message: MESSAGES.CREATE_SUCCESS('Driver profile'),
        data: { driver },
      })
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Get all driver profiles with pagination and filters
 * @route GET /api/v1/admin/drivers
 * @access Admin
 */
export const getDriverProfiles = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // The query params are already validated by the middleware
    const query = req.query as unknown as InferredGetDriverProfilesQuery

    const { drivers, count } = await driverService.getDriverProfiles(
      query as IGetDriverProfilesQuery
    )

    res.status(STATUS_CODES.SUCCESS.OK).json(
      APIResponse.sendSuccess({
        message: MESSAGES.RETRIEVE_SUCCESS('Driver profiles'),
        data: { drivers, count },
      })
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Get a driver profile by ID
 * @route GET /api/v1/admin/drivers/:driverId
 * @access Admin
 */
export const getDriverProfileById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { driverId } = req.params

    if (!driverId) {
      res.status(STATUS_CODES.CLIENT_ERROR.BAD_REQUEST).json(
        APIResponse.sendError({
          message: MESSAGES.REQUIRED('Driver ID'),
        })
      )
      return
    }

    const driver = await driverService.getDriverProfileById(driverId)

    if (!driver) {
      res.status(STATUS_CODES.CLIENT_ERROR.NOT_FOUND).json(
        APIResponse.sendError({
          message: MESSAGES.NOT_FOUND('Driver profile'),
        })
      )
      return
    }

    res.status(STATUS_CODES.SUCCESS.OK).json(
      APIResponse.sendSuccess({
        message: MESSAGES.RETRIEVE_SUCCESS('Driver profile'),
        data: { driver },
      })
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Get a driver profile by user ID
 * @route GET /api/v1/admin/drivers/user/:userId
 * @access Admin
 */
export const getDriverProfileByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { userId } = req.params

    if (!userId) {
      res.status(STATUS_CODES.CLIENT_ERROR.BAD_REQUEST).json(
        APIResponse.sendError({
          message: MESSAGES.REQUIRED('User ID'),
        })
      )
      return
    }

    const driver = await driverService.findDriverProfileByUserId(userId)

    if (!driver) {
      res.status(STATUS_CODES.CLIENT_ERROR.NOT_FOUND).json(
        APIResponse.sendError({
          message: MESSAGES.NOT_FOUND('Driver profile'),
        })
      )
      return
    }

    res.status(STATUS_CODES.SUCCESS.OK).json(
      APIResponse.sendSuccess({
        message: MESSAGES.RETRIEVE_SUCCESS('Driver profile'),
        data: { driver },
      })
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Update a driver profile
 * @route PUT /api/v1/admin/drivers/:driverId
 * @access Admin
 */
export const updateDriverProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { driverId } = req.params
    // The request body is already validated by the middleware
    const driverData: InferredUpdateDriverProfileRequest = req.body

    if (!driverId) {
      res.status(STATUS_CODES.CLIENT_ERROR.BAD_REQUEST).json(
        APIResponse.sendError({
          message: MESSAGES.REQUIRED('Driver ID'),
        })
      )
      return
    }

    // Check if driver profile exists
    const existingDriverProfile = await driverService.getDriverProfileById(
      driverId
    )
    if (!existingDriverProfile) {
      res.status(STATUS_CODES.CLIENT_ERROR.NOT_FOUND).json(
        APIResponse.sendError({
          message: MESSAGES.NOT_FOUND('Driver profile'),
        })
      )
      return
    }

    // Validate license number if provided
    if (
      driverData.licenseNumber &&
      driverData.licenseNumber !== existingDriverProfile.licenseNumber
    ) {
      const driverWithSameLicense =
        await driverService.findDriverProfileByLicenseNumber(
          driverData.licenseNumber
        )

      if (driverWithSameLicense) {
        res.status(STATUS_CODES.CLIENT_ERROR.CONFLICT).json(
          APIResponse.sendError({
            message: MESSAGES.EXISTS('Driver with this license number'),
          })
        )
        return
      }
    }

    const driver = await driverService.updateDriverProfile(
      driverId,
      driverData as IUpdateDriverProfileRequest
    )

    res.status(STATUS_CODES.SUCCESS.OK).json(
      APIResponse.sendSuccess({
        message: MESSAGES.UPDATE_SUCCESS('Driver profile'),
        data: { driver },
      })
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Assign a vehicle to a driver
 * @route POST /api/v1/admin/drivers/:driverId/vehicle
 * @access Admin
 */
export const assignVehicleToDriver = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { driverId } = req.params
    // The request body is already validated by the middleware
    const data: InferredAssignVehicleRequest = req.body

    if (!driverId) {
      res.status(STATUS_CODES.CLIENT_ERROR.BAD_REQUEST).json(
        APIResponse.sendError({
          message: MESSAGES.REQUIRED('Driver ID'),
        })
      )
      return
    }

    // Check if driver profile exists
    const driverProfile = await driverService.getDriverProfileById(driverId)
    if (!driverProfile) {
      res.status(STATUS_CODES.CLIENT_ERROR.NOT_FOUND).json(
        APIResponse.sendError({
          message: MESSAGES.NOT_FOUND('Driver profile'),
        })
      )
      return
    }

    // Check if driver already has a vehicle
    const hasVehicle = driverProfile.vehicle !== null
    if (hasVehicle) {
      res.status(STATUS_CODES.CLIENT_ERROR.CONFLICT).json(
        APIResponse.sendError({
          message: MESSAGES.DRIVER.ALREADY_HAS_VEHICLE,
          extra: {
            currentVehicleId: driverProfile.vehicle?.id,
          },
        })
      )
      return
    }

    // Check if vehicle exists
    const vehicle = await vehicleService.getVehicleById(data.vehicleId)
    if (!vehicle) {
      res.status(STATUS_CODES.CLIENT_ERROR.NOT_FOUND).json(
        APIResponse.sendError({
          message: MESSAGES.NOT_FOUND('Vehicle'),
        })
      )
      return
    }

    // Check if vehicle is already assigned to another driver
    if (vehicle.driverProfile) {
      res.status(STATUS_CODES.CLIENT_ERROR.CONFLICT).json(
        APIResponse.sendError({
          message: MESSAGES.VEHICLE.ALREADY_ASSIGNED,
          extra: {
            assignedToDriver: vehicle.driverProfile.user.name,
            driverId: vehicle.driverProfile.id,
          },
        })
      )
      return
    }

    const driver = await driverService.assignVehicleToDriver(
      driverId,
      data.vehicleId
    )

    res.status(STATUS_CODES.SUCCESS.OK).json(
      APIResponse.sendSuccess({
        message: 'Vehicle assigned to driver successfully',
        data: { driver },
      })
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Unassign a vehicle from a driver
 * @route DELETE /api/v1/admin/drivers/:driverId/vehicle
 * @access Admin
 */
export const unassignVehicleFromDriver = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { driverId } = req.params

    if (!driverId) {
      res.status(STATUS_CODES.CLIENT_ERROR.BAD_REQUEST).json(
        APIResponse.sendError({
          message: MESSAGES.REQUIRED('Driver ID'),
        })
      )
      return
    }

    // Check if driver profile exists
    const driverProfile = await driverService.getDriverProfileById(driverId)
    if (!driverProfile) {
      res.status(STATUS_CODES.CLIENT_ERROR.NOT_FOUND).json(
        APIResponse.sendError({
          message: MESSAGES.NOT_FOUND('Driver profile'),
        })
      )
      return
    }

    // Check if driver has a vehicle assigned
    const hasVehicle = driverProfile.vehicle !== null
    if (!hasVehicle) {
      res.status(STATUS_CODES.CLIENT_ERROR.BAD_REQUEST).json(
        APIResponse.sendError({
          message: MESSAGES.NOT_EXISTS('Vehicle assignment'),
        })
      )
      return
    }

    const driver = await driverService.unassignVehicleFromDriver(driverId)

    res.status(STATUS_CODES.SUCCESS.OK).json(
      APIResponse.sendSuccess({
        message: 'Vehicle unassigned from driver successfully',
        data: { driver },
      })
    )
  } catch (error) {
    next(error)
  }
}
