import { Router } from 'express'
import v1Routes from './v1'

const router = Router()

// API Routes with versioning
router.use('/api/v1', v1Routes)

export default router
