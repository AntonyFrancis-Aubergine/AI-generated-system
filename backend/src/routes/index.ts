import { Router } from 'express';
import healthRouter from './health.routes';

const router = Router();

// Health check route
router.use('/health', healthRouter);

export default router;
