import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { TicketService } from '../services/ticket.service';
import { AppError } from '../utils/errorHandler';
import { successResponse } from '../utils/responseGenerator';
import { generateResponse } from '../utils/responseGenerator';

export class TicketController {
  private ticketService: TicketService;

  constructor() {
    this.ticketService = new TicketService();
  }

  // Validation middleware
  static createTicketValidation = [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('type').isIn(['bug', 'feature', 'task', 'improvement']).withMessage('Invalid ticket type'),
    body('priority').isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid priority'),
    body('projectId').isMongoId().withMessage('Invalid project ID'),
    body('dueDate').optional().isISO8601().withMessage('Invalid due date')
  ];

  static updateTicketValidation = [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
    body('type').optional().isIn(['bug', 'feature', 'task', 'improvement']).withMessage('Invalid ticket type'),
    body('priority').optional().isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid priority'),
    body('dueDate').optional().isISO8601().withMessage('Invalid due date')
  ];

  createTicket = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(errors.array()[0].msg, 400);
      }

      const ticketData = {
        ...req.body,
        reporterId: req.user?.id
      };

      const ticket = await this.ticketService.createTicket(ticketData);
      res.status(201).json(successResponse(ticket, 'Ticket created successfully'));
    } catch (error) {
      next(error);
    }
  };

  getTicket = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ticket = await this.ticketService.getTicketById(req.params.ticketId);
      res.json(successResponse(ticket));
    } catch (error) {
      next(error);
    }
  };

  updateTicket = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new AppError(errors.array()[0].msg, 400);
      }

      const ticket = await this.ticketService.updateTicket(req.params.ticketId, req.body);
      res.json(successResponse(ticket, 'Ticket updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  deleteTicket = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.ticketService.deleteTicket(req.params.ticketId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  getTicketsByProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { projectId } = req.params;
      const tickets = await this.ticketService.getProjectTickets(projectId);
      res.json(successResponse(tickets));
    } catch (error) {
      next(error);
    }
  };

  addComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { content } = req.body;
      if (!content) {
        throw new AppError('Comment content is required', 400);
      }

      const ticket = await this.ticketService.addComment(
        req.params.ticketId,
        req.user?.id!,
        content
      );
      res.status(201).json(successResponse(ticket, 'Comment added successfully'));
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status } = req.body;
      if (!status) {
        throw new AppError('Status is required', 400);
      }

      const ticket = await this.ticketService.updateStatus(req.params.ticketId, status);
      res.json(successResponse(ticket, 'Status updated successfully'));
    } catch (error) {
      next(error);
    }
  };

  assignTicket = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { assigneeId } = req.body;
      if (!assigneeId) {
        throw new AppError('Assignee ID is required', 400);
      }

      const ticket = await this.ticketService.assignTicket(req.params.ticketId, assigneeId);
      res.json(successResponse(ticket, 'Ticket assigned successfully'));
    } catch (error) {
      next(error);
    }
  };
} 