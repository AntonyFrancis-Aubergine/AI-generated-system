import { Request, Response, NextFunction } from 'express'
import { APIResponse } from '../utils/responseGenerator'
import { MESSAGES } from '../utils/messages'
import * as vehicleService from '../services/vehicle.service'
import { IUpdateVehicleRequest, IGetVehiclesQuery } from '../types'
import { STATUS_CODES } from '../utils/statusCodes'
import { z } from 'zod'
import {
  createVehicleSchema,
  updateVehicleSchema,
  getVehiclesQuerySchema,
} from '../schemas'

// Helper type to extract the inferred type from Zod schema
type InferredCreateVehicleRequest = z.infer<typeof createVehicleSchema>
type InferredUpdateVehicleRequest = z.infer<typeof updateVehicleSchema>
type InferredGetVehiclesQuery = z.infer<typeof getVehiclesQuerySchema>

/**
 * Create a new vehicle
 * @route POST /api/v1/admin/vehicles
 * @access Admin
 */
export const createVehicle = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // The request body is already validated by the middleware
    const vehicleData: InferredCreateVehicleRequest = req.body

    // Check if vehicle with same registration number already exists
    const existingVehicle =
      await vehicleService.findVehicleByRegistrationNumber(
        vehicleData.registrationNumber
      )

    if (existingVehicle) {
      res.status(STATUS_CODES.CLIENT_ERROR.CONFLICT).json(
        APIResponse.sendError({
          message: MESSAGES.EXISTS('Vehicle with this registration number'),
        })
      )
      return
    }

    const vehicle = await vehicleService.createVehicle(vehicleData)

    res.status(STATUS_CODES.SUCCESS.CREATED).json(
      APIResponse.sendSuccess({
        message: MESSAGES.CREATE_SUCCESS('Vehicle'),
        data: { vehicle },
      })
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Get all vehicles with pagination and filters
 * @route GET /api/v1/admin/vehicles
 * @access Admin
 */
export const getVehicles = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // The query params are already validated by the middleware
    const query = req.query as unknown as InferredGetVehiclesQuery

    const { vehicles, count } = await vehicleService.getVehicles(
      query as IGetVehiclesQuery
    )

    res.status(STATUS_CODES.SUCCESS.OK).json(
      APIResponse.sendSuccess({
        message: MESSAGES.RETRIEVE_SUCCESS('Vehicles'),
        data: { vehicles, count },
      })
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Get a vehicle by ID
 * @route GET /api/v1/admin/vehicles/:vehicleId
 * @access Admin
 */
export const getVehicleById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { vehicleId } = req.params

    if (!vehicleId) {
      res.status(STATUS_CODES.CLIENT_ERROR.BAD_REQUEST).json(
        APIResponse.sendError({
          message: MESSAGES.REQUIRED('Vehicle ID'),
        })
      )
      return
    }

    const vehicle = await vehicleService.getVehicleById(vehicleId)

    if (!vehicle) {
      res.status(STATUS_CODES.CLIENT_ERROR.NOT_FOUND).json(
        APIResponse.sendError({
          message: MESSAGES.NOT_FOUND('Vehicle'),
        })
      )
      return
    }

    res.status(STATUS_CODES.SUCCESS.OK).json(
      APIResponse.sendSuccess({
        message: MESSAGES.RETRIEVE_SUCCESS('Vehicle'),
        data: { vehicle },
      })
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Update a vehicle
 * @route PUT /api/v1/admin/vehicles/:vehicleId
 * @access Admin
 */
export const updateVehicle = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { vehicleId } = req.params
    // The request body is already validated by the middleware
    const vehicleData: InferredUpdateVehicleRequest = req.body

    if (!vehicleId) {
      res.status(STATUS_CODES.CLIENT_ERROR.BAD_REQUEST).json(
        APIResponse.sendError({
          message: MESSAGES.REQUIRED('Vehicle ID'),
        })
      )
      return
    }

    // Check if vehicle exists
    const existingVehicle = await vehicleService.getVehicleById(vehicleId)

    if (!existingVehicle) {
      res.status(STATUS_CODES.CLIENT_ERROR.NOT_FOUND).json(
        APIResponse.sendError({
          message: MESSAGES.NOT_FOUND('Vehicle'),
        })
      )
      return
    }

    // Validate registration number if provided
    if (
      vehicleData.registrationNumber &&
      vehicleData.registrationNumber !== existingVehicle.registrationNumber
    ) {
      const vehicleWithSameReg =
        await vehicleService.findVehicleByRegistrationNumber(
          vehicleData.registrationNumber
        )

      if (vehicleWithSameReg) {
        res.status(STATUS_CODES.CLIENT_ERROR.CONFLICT).json(
          APIResponse.sendError({
            message: MESSAGES.EXISTS('Vehicle with this registration number'),
          })
        )
        return
      }
    }

    const vehicle = await vehicleService.updateVehicle(
      vehicleId,
      vehicleData as IUpdateVehicleRequest
    )

    res.status(STATUS_CODES.SUCCESS.OK).json(
      APIResponse.sendSuccess({
        message: MESSAGES.UPDATE_SUCCESS('Vehicle'),
        data: { vehicle },
      })
    )
  } catch (error) {
    next(error)
  }
}

/**
 * Delete a vehicle
 * @route DELETE /api/v1/admin/vehicles/:vehicleId
 * @access Admin
 */
export const deleteVehicle = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { vehicleId } = req.params

    if (!vehicleId) {
      res.status(STATUS_CODES.CLIENT_ERROR.BAD_REQUEST).json(
        APIResponse.sendError({
          message: MESSAGES.REQUIRED('Vehicle ID'),
        })
      )
      return
    }

    // Check if vehicle exists
    const existingVehicle = await vehicleService.getVehicleById(vehicleId)

    if (!existingVehicle) {
      res.status(STATUS_CODES.CLIENT_ERROR.NOT_FOUND).json(
        APIResponse.sendError({
          message: MESSAGES.NOT_FOUND('Vehicle'),
        })
      )
      return
    }

    // Check if vehicle is assigned to a driver
    if (existingVehicle.driverProfile) {
      res.status(STATUS_CODES.CLIENT_ERROR.CONFLICT).json(
        APIResponse.sendError({
          message: MESSAGES.VEHICLE.ALREADY_ASSIGNED,
          extra: {
            driverName: existingVehicle.driverProfile.user.name,
            driverId: existingVehicle.driverProfile.id,
          },
        })
      )
      return
    }

    await vehicleService.deleteVehicle(vehicleId)

    res.status(STATUS_CODES.SUCCESS.OK).json(
      APIResponse.sendSuccess({
        message: MESSAGES.DELETE_SUCCESS('Vehicle'),
      })
    )
  } catch (error) {
    next(error)
  }
}
