import { Request, Response } from 'express';
import { HealthService } from '../services/health.service';

export class HealthController {
  private healthService: HealthService;

  constructor() {
    this.healthService = new HealthService();
  }

  /**
   * Check the health status of the API
   * @param req Express Request object
   * @param res Express Response object
   */
  public checkHealth = async (_req: Request, res: Response): Promise<void> => {
    try {
      const healthStatus = await this.healthService.checkHealth();
      res.status(200).json(healthStatus);
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Health check failed' });
    }
  };
}
