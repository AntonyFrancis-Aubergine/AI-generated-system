import { Request, Response, NextFunction } from 'express';
import { TicketAdvancedService } from '../services/ticketAdvanced.service';
import { AppError } from '../utils/errorHandler';
import { successResponse } from '../utils/responseGenerator';

export class TicketAdvancedController {
  private ticketAdvancedService: TicketAdvancedService;

  constructor() {
    this.ticketAdvancedService = new TicketAdvancedService();
  }

  // Advanced Search
  searchTickets = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tickets = await this.ticketAdvancedService.searchTickets(req.query);
      res.json(successResponse(tickets));
    } catch (error) {
      next(error);
    }
  };

  // Ticket History
  getTicketHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const history = await this.ticketAdvancedService.getTicketHistory(req.params.ticketId);
      res.json(successResponse(history));
    } catch (error) {
      next(error);
    }
  };

  // Ticket Dependencies
  addDependency = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { dependentTicketId, type } = req.body;
      if (!dependentTicketId || !type) {
        throw new AppError('Dependent ticket ID and type are required', 400);
      }

      const dependency = await this.ticketAdvancedService.addDependency(
        req.params.ticketId,
        dependentTicketId,
        type
      );
      res.status(201).json(successResponse(dependency, 'Dependency added successfully'));
    } catch (error) {
      next(error);
    }
  };

  getDependencies = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dependencies = await this.ticketAdvancedService.getDependencies(req.params.ticketId);
      res.json(successResponse(dependencies));
    } catch (error) {
      next(error);
    }
  };

  // Advanced Reporting
  generateReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        throw new AppError('Start date and end date are required', 400);
      }

      const report = await this.ticketAdvancedService.generateTicketReport(
        req.params.projectId,
        {
          startDate: new Date(startDate as string),
          endDate: new Date(endDate as string)
        }
      );
      res.json(successResponse(report));
    } catch (error) {
      next(error);
    }
  };
} 