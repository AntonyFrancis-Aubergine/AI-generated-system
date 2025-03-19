/**
 * Service for health-related operations
 */
export class HealthService {
  /**
   * Check the health status of the application
   * @returns Object containing status information
   */
  public checkHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}

export default new HealthService();
