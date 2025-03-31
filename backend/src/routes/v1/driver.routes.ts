import { Router } from 'express'
import { isDriver, hasDriverProfile } from '../../middlewares/driver.middleware'
// import {
//   validate,
//   validateQuery,
// } from '../../middlewares/validations.middleware'
// import * as schemas from '../../schemas'

const router = Router()

// All routes require driver role and a valid driver profile
router.use(isDriver)
router.use(hasDriverProfile)

// Driver routes
// Add actual driver routes when controller methods are implemented
// For example: router.get('/profile', driverController.getDriverProfile)

export default router
