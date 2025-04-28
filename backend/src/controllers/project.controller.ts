import { Request, Response, NextFunction } from 'express';
import { ProjectService } from '../services/project.service';
import { AppError } from '../utils/errorHandler';

export class ProjectController {
  private projectService: ProjectService;

  constructor() {
    this.projectService = new ProjectService();
  }

  createProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const project = await this.projectService.createProject(req.body);
      res.status(201).json(project);
    } catch (error) {
      next(error);
    }
  };

  getProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const project = await this.projectService.getProject(req.params.projectId);
      if (!project) {
        throw new AppError('Project not found', 404);
      }
      res.json(project);
    } catch (error) {
      next(error);
    }
  };

  updateProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const project = await this.projectService.updateProject(
        req.params.projectId,
        req.body
      );
      if (!project) {
        throw new AppError('Project not found', 404);
      }
      res.json(project);
    } catch (error) {
      next(error);
    }
  };

  deleteProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.projectService.deleteProject(req.params.projectId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  getProjectsByTeam = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projects = await this.projectService.getProjectsByTeam(req.params.teamId);
      res.json(projects);
    } catch (error) {
      next(error);
    }
  };

  updateBoardColumns = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const project = await this.projectService.updateBoardColumns(
        req.params.projectId,
        req.body.columns
      );
      if (!project) {
        throw new AppError('Project not found', 404);
      }
      res.json(project);
    } catch (error) {
      next(error);
    }
  };
} 