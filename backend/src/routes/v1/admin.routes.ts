import { Router } from 'express'
import * as vehicleController from '../../controllers/vehicle.controller'
import * as driverController from '../../controllers/driver.controller'
import { requireRole } from '../../middlewares/auth.middleware'
import { UserRole } from '@prisma/client'
import {
  validate,
  validateQuery,
} from '../../middlewares/validations.middleware'
import * as schemas from '../../schemas'

const router = Router()

// Apply admin middleware to all routes
router.use(requireRole([UserRole.ADMIN]))

// Vehicle routes
router.post(
  '/vehicles',
  validate(schemas.createVehicleSchema),
  vehicleController.createVehicle
)
router.get(
  '/vehicles',
  validateQuery(schemas.getVehiclesQuerySchema),
  vehicleController.getVehicles
)
router.get('/vehicles/:vehicleId', vehicleController.getVehicleById)
router.put(
  '/vehicles/:vehicleId',
  validate(schemas.updateVehicleSchema),
  vehicleController.updateVehicle
)
router.delete('/vehicles/:vehicleId', vehicleController.deleteVehicle)

// Driver routes
router.post(
  '/drivers',
  validate(schemas.createDriverProfileSchema),
  driverController.createDriverProfile
)
router.get(
  '/drivers',
  validateQuery(schemas.getDriverProfilesQuerySchema),
  driverController.getDriverProfiles
)
router.get('/drivers/:driverId', driverController.getDriverProfileById)
router.get('/drivers/user/:userId', driverController.getDriverProfileByUserId)
router.put(
  '/drivers/:driverId',
  validate(schemas.updateDriverProfileSchema),
  driverController.updateDriverProfile
)
router.post(
  '/drivers/:driverId/vehicle',
  validate(schemas.assignVehicleSchema),
  driverController.assignVehicleToDriver
)
router.delete(
  '/drivers/:driverId/vehicle',
  driverController.unassignVehicleFromDriver
)

export default router
