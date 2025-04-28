import { Sprint, ISprint } from '../models/sprint.model';
import { Ticket } from '../models/ticket.model';
import { AppError } from '../utils/errorHandler';
import { Types } from 'mongoose';

export class SprintService {
  async createSprint(sprintData: Partial<ISprint>) {
    return await Sprint.create(sprintData);
  }

  async getSprint(sprintId: string) {
    const sprint = await Sprint.findById(sprintId)
      .populate('projectId', 'name')
      .populate('createdBy', 'name email')
      .populate('tickets', 'title status priority');

    if (!sprint) {
      throw new AppError('Sprint not found', 404);
    }
    return sprint;
  }

  async updateSprint(sprintId: string, updateData: Partial<ISprint>) {
    const sprint = await Sprint.findByIdAndUpdate(
      sprintId,
      updateData,
      { new: true }
    )
      .populate('projectId', 'name')
      .populate('createdBy', 'name email')
      .populate('tickets', 'title status priority');

    if (!sprint) {
      throw new AppError('Sprint not found', 404);
    }
    return sprint;
  }

  async deleteSprint(sprintId: string) {
    const sprint = await Sprint.findByIdAndDelete(sprintId);
    if (!sprint) {
      throw new AppError('Sprint not found', 404);
    }
  }

  async getSprintsByProject(projectId: string, filters: any = {}) {
    const query = { projectId, ...filters };
    return await Sprint.find(query)
      .populate('createdBy', 'name email')
      .populate('tickets', 'title status priority')
      .sort({ startDate: -1 });
  }

  async addTicketToSprint(sprintId: string, ticketId: string) {
    const sprint = await Sprint.findById(sprintId);
    if (!sprint) {
      throw new AppError('Sprint not found', 404);
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new AppError('Ticket not found', 404);
    }

    // Check if ticket is already in the sprint
    if (sprint.tickets.includes(new Types.ObjectId(ticketId))) {
      throw new AppError('Ticket already in sprint', 400);
    }

    // Add ticket to sprint
    sprint.tickets.push(new Types.ObjectId(ticketId));
    await sprint.save();

    return sprint;
  }

  async removeTicketFromSprint(sprintId: string, ticketId: string) {
    const sprint = await Sprint.findById(sprintId);
    if (!sprint) {
      throw new AppError('Sprint not found', 404);
    }

    // Remove ticket from sprint
    sprint.tickets = sprint.tickets.filter(
      ticket => !ticket.equals(new Types.ObjectId(ticketId))
    );
    await sprint.save();

    return sprint;
  }

  async startSprint(sprintId: string) {
    const sprint = await Sprint.findById(sprintId);
    if (!sprint) {
      throw new AppError('Sprint not found', 404);
    }

    if (sprint.status !== 'planned') {
      throw new AppError('Only planned sprints can be started', 400);
    }

    // Check for overlapping active sprints
    const overlappingSprint = await Sprint.findOne({
      projectId: sprint.projectId,
      status: 'active',
      _id: { $ne: sprintId }
    });

    if (overlappingSprint) {
      throw new AppError('Cannot start sprint while another sprint is active', 400);
    }

    sprint.status = 'active';
    await sprint.save();

    return sprint;
  }

  async completeSprint(sprintId: string) {
    const sprint = await Sprint.findById(sprintId);
    if (!sprint) {
      throw new AppError('Sprint not found', 404);
    }

    if (sprint.status !== 'active') {
      throw new AppError('Only active sprints can be completed', 400);
    }

    sprint.status = 'completed';
    await sprint.save();

    return sprint;
  }

  async calculateSprintVelocity(sprintId: string) {
    const sprint = await Sprint.findById(sprintId)
      .populate('tickets', 'status priority');
    
    if (!sprint) {
      throw new AppError('Sprint not found', 404);
    }

    // Calculate velocity based on completed tickets
    const completedTickets = sprint.tickets.filter(
      (ticket: any) => ticket.status === 'resolved'
    );

    // Simple velocity calculation (can be customized based on your needs)
    const velocity = completedTickets.length;
    sprint.velocity = velocity;
    await sprint.save();

    return sprint;
  }
} 