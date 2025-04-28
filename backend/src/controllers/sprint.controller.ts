import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { SprintService } from '../services/sprint.service';
import { AppError } from '../utils/errorHandler';
import { successResponse } from '../utils/responseGenerator';

export class SprintController {
  private sprintService: SprintService;

  constructor() {
    this.sprintService = new SprintService();
  }

  // Validation middleware
  static createSprintValidation = [
    body('name').notEmpty().withMessage('Name is required'),
    body('projectId').isMongoId().withMessage('Invalid project ID'),
    body('startDate').isISO8601().withMessage('Invalid start date'),
    body('endDate').isISO8601().withMessage('Invalid end date'),
    body('goal').notEmpty().withMessage('Sprint goal is required')
  ];

  static updateSprintValidation = [
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    body('startDate').optional().isISO8601().withMessage('Invalid start date'),
    body('endDate').optional().isISO8601().withMessage('Invalid end date'),
    body('goal').optional().notEmpty().withMessage('Sprint goal cannot be empty'),
    body('status').optional().isIn(['planned', 'active', 'completed', 'cancelled'])
      .withMessage('Invalid status')
  ];

  createSprint = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(errors.array()[0].msg, 400);
      }

      const sprintData = {
        ...req.body,
        createdBy: req.user._id
      };

      const sprint = await this.sprintService.createSprint(sprintData);
      res.status(201).json(successResponse(sprint, 'Sprint created successfully'));
    } catch (error) {
      next(error);
    }
  };

  getSprint = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sprint = await this.sprintService.getSprint(req.params.sprintId);
      res.json(successResponse(sprint));
    } catch (error) {
      next(error);
    }
  };

  updateSprint = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(errors.array()[0].msg, 400);
      }

      const sprint = await this.sprintService.updateSprint(req.params.sprintId, req.body);
      res.json(successResponse(sprint, 'Sprint updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  deleteSprint = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.sprintService.deleteSprint(req.params.sprintId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  getSprintsByProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId } = req.params;
      const filters = req.query;
      const sprints = await this.sprintService.getSprintsByProject(projectId, filters);
      res.json(successResponse(sprints));
    } catch (error) {
      next(error);
    }
  };

  addTicketToSprint = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ticketId } = req.body;
      if (!ticketId) {
        throw new AppError('Ticket ID is required', 400);
      }

      const sprint = await this.sprintService.addTicketToSprint(
        req.params.sprintId,
        ticketId
      );
      res.json(successResponse(sprint, 'Ticket added to sprint successfully'));
    } catch (error) {
      next(error);
    }
  };

  removeTicketFromSprint = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ticketId } = req.body;
      if (!ticketId) {
        throw new AppError('Ticket ID is required', 400);
      }

      const sprint = await this.sprintService.removeTicketFromSprint(
        req.params.sprintId,
        ticketId
      );
      res.json(successResponse(sprint, 'Ticket removed from sprint successfully'));
    } catch (error) {
      next(error);
    }
  };

  startSprint = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sprint = await this.sprintService.startSprint(req.params.sprintId);
      res.json(successResponse(sprint, 'Sprint started successfully'));
    } catch (error) {
      next(error);
    }
  };

  completeSprint = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sprint = await this.sprintService.completeSprint(req.params.sprintId);
      res.json(successResponse(sprint, 'Sprint completed successfully'));
    } catch (error) {
      next(error);
    }
  };

  calculateVelocity = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sprint = await this.sprintService.calculateSprintVelocity(req.params.sprintId);
      res.json(successResponse(sprint, 'Sprint velocity calculated successfully'));
    } catch (error) {
      next(error);
    }
  };
} 