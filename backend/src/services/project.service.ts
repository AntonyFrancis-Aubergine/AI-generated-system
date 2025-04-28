import { Project } from '../models/project.model';
import { AppError } from '../utils/errorHandler';
import { Types } from 'mongoose';

export class ProjectService {
  async createProject(projectData: any) {
    return await Project.create(projectData);
  }

  async getProject(projectId: string) {
    return await Project.findById(projectId);
  }

  async updateProject(projectId: string, updateData: any) {
    return await Project.findByIdAndUpdate(projectId, updateData, { new: true });
  }

  async deleteProject(projectId: string) {
    const result = await Project.findByIdAndDelete(projectId);
    if (!result) {
      throw new AppError('Project not found', 404);
    }
  }

  async getProjectsByTeam(teamId: string) {
    return await Project.find({ teamId });
  }

  async updateBoardColumns(projectId: string, columns: any[]) {
    return await Project.findByIdAndUpdate(
      projectId,
      { $set: { boardColumns: columns } },
      { new: true }
    );
  }

  async addTicketToColumn(projectId: string, columnName: string, ticketId: Types.ObjectId) {
    return await Project.findOneAndUpdate(
      { _id: projectId, 'boardColumns.name': columnName },
      { $push: { 'boardColumns.$.tickets': ticketId } },
      { new: true }
    );
  }

  async removeTicketFromColumn(projectId: string, columnName: string, ticketId: Types.ObjectId) {
    return await Project.findOneAndUpdate(
      { _id: projectId, 'boardColumns.name': columnName },
      { $pull: { 'boardColumns.$.tickets': ticketId } },
      { new: true }
    );
  }
} 