import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { 
  createTeam as createTeamService,
  getTeam as getTeamService,
  updateTeam as updateTeamService,
  deleteTeam as deleteTeamService,
  addTeamMember as addTeamMemberService,
  removeTeamMember as removeTeamMemberService,
  getTeamMembers as getTeamMembersService,
  getTeamProjects as getTeamProjectsService
} from '../services/team.service';
import { successResponse, errorResponse } from '../utils/responseGenerator';
import { AppError } from '../middleware/errorHandler';

export const createTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('Creating team with data:', req.body);
    console.log('User making request:', req.user);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      throw new AppError(errors.array()[0].msg, 400);
    }

    if (!req.user?.id) {
      console.log('No user ID found in request');
      throw new AppError('User not authenticated', 401);
    }

    const team = await createTeamService({
      ...req.body,
      createdBy: req.user.id
    });

    console.log('Team created successfully:', team);
    res.status(201).json(successResponse(team, 'Team created successfully'));
  } catch (error) {
    console.error('Error creating team:', error);
    next(error);
  }
};

export const getTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const team = await getTeamService(req.params.teamId);
    res.json(successResponse(team, 'Team retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(errors.array()[0].msg, 400);
    }

    const team = await updateTeamService(req.params.teamId, req.body);
    res.json(successResponse(team, 'Team updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteTeam = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await deleteTeamService(req.params.teamId);
    res.json(successResponse(null, 'Team deleted successfully'));
  } catch (error) {
    next(error);
  }
};

export const addTeamMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new AppError(errors.array()[0].msg, 400);
    }

    const team = await addTeamMemberService(
      req.params.teamId,
      req.body.userId,
      req.body.role
    );
    res.json(successResponse(team, 'Team member added successfully'));
  } catch (error) {
    next(error);
  }
};

export const removeTeamMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const team = await removeTeamMemberService(
      req.params.teamId,
      req.params.userId
    );
    res.json(successResponse(team, 'Team member removed successfully'));
  } catch (error) {
    next(error);
  }
};

export const getTeamMembers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const members = await getTeamMembersService(req.params.teamId);
    res.json(successResponse(members, 'Team members retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const getTeamProjects = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const projects = await getTeamProjectsService(req.params.teamId);
    res.json(successResponse(projects, 'Team projects retrieved successfully'));
  } catch (error) {
    next(error);
  }
}; 