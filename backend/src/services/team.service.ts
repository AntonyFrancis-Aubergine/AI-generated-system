import { Team, ITeam } from '../models';
import { AppError } from '../middleware/errorHandler';
import { TEAM_MESSAGES } from '../utils/messages';
import { Types } from 'mongoose';
import { ROLES } from '../utils/constants';

interface CreateTeamData {
  name: string;
  description: string;
  createdBy: string;
}

export const createTeam = async (data: CreateTeamData): Promise<ITeam> => {
  try {
    const team = await Team.create(data);
    return team;
  } catch (error) {
    if ((error as any).code === 11000) {
      throw new AppError(TEAM_MESSAGES.NAME_EXISTS, 400);
    }
    throw error;
  }
};

export const getTeam = async (teamId: string): Promise<ITeam> => {
  const team = await Team.findById(teamId)
    .populate('members.userId', 'name email role')
    .populate('projects', 'name description');
  
  if (!team) {
    throw new AppError(TEAM_MESSAGES.NOT_FOUND, 404);
  }

  return team;
};

export const updateTeam = async (
  teamId: string,
  data: Partial<CreateTeamData>
): Promise<ITeam> => {
  const team = await Team.findByIdAndUpdate(
    teamId,
    { $set: data },
    { new: true, runValidators: true }
  );

  if (!team) {
    throw new AppError(TEAM_MESSAGES.NOT_FOUND, 404);
  }

  return team;
};

export const deleteTeam = async (teamId: string): Promise<void> => {
  const team = await Team.findByIdAndDelete(teamId);

  if (!team) {
    throw new AppError(TEAM_MESSAGES.NOT_FOUND, 404);
  }
};

export const addTeamMember = async (
  teamId: string,
  userId: string,
  role: typeof ROLES[keyof typeof ROLES]
): Promise<ITeam> => {
  const team = await Team.findById(teamId);

  if (!team) {
    throw new AppError(TEAM_MESSAGES.NOT_FOUND, 404);
  }

  // Check if user is already a member
  const isMember = team.members.some(
    member => member.userId.toString() === userId
  );

  if (isMember) {
    throw new AppError(TEAM_MESSAGES.MEMBER_EXISTS, 400);
  }

  team.members.push({
    userId: new Types.ObjectId(userId),
    role
  });

  await team.save();
  return team;
};

export const removeTeamMember = async (
  teamId: string,
  userId: string
): Promise<ITeam> => {
  const team = await Team.findById(teamId);

  if (!team) {
    throw new AppError(TEAM_MESSAGES.NOT_FOUND, 404);
  }

  team.members = team.members.filter(
    member => member.userId.toString() !== userId
  );

  await team.save();
  return team;
};

export const getTeamMembers = async (teamId: string) => {
  const team = await Team.findById(teamId)
    .populate('members.userId', 'name email role');

  if (!team) {
    throw new AppError(TEAM_MESSAGES.NOT_FOUND, 404);
  }

  return team.members;
};

export const getTeamProjects = async (teamId: string) => {
  const team = await Team.findById(teamId)
    .populate('projects', 'name description status');

  if (!team) {
    throw new AppError(TEAM_MESSAGES.NOT_FOUND, 404);
  }

  return team.projects;
}; 