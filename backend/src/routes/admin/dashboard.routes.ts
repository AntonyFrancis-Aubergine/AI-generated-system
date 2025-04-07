import { Router, Request, Response, NextFunction } from "express";
import { getDashboardStats } from "../../controllers/dashboard.controller";

const router = Router();

/**
 * @route GET /api/admin/dashboard/stats
 * @description Get dashboard statistics for admin
 * @access Private (Admin)
 */
router.get("/stats", (req: Request, res: Response, next: NextFunction) => {
  try {
    getDashboardStats(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
