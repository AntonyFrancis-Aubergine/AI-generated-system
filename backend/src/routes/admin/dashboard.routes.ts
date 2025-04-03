import { Router, Request, Response } from "express";
import { getDashboardStats } from "../../controllers/dashboard.controller";

const router = Router();

/**
 * @route GET /api/admin/dashboard/stats
 * @description Get dashboard statistics for admin
 * @access Private (Admin)
 */
router.get("/stats", function (req: Request, res: Response) {
  return getDashboardStats(req, res);
});

export default router;
