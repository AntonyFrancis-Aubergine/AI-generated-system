import { Ticket, ITicket } from '../models/ticket.model';
import { AppError } from '../utils/errorHandler';
import mongoose from 'mongoose';

export class TicketService {
  async createTicket(ticketData: Partial<ITicket>): Promise<ITicket> {
    const ticket = new Ticket(ticketData);
    return await ticket.save();
  }

  async getTicketById(ticketId: string): Promise<ITicket> {
    const ticket = await Ticket.findById(ticketId)
      .populate('reporterId', 'name email')
      .populate('assigneeId', 'name email')
      .populate('projectId', 'name');
    
    if (!ticket) {
      throw new AppError('Ticket not found', 404);
    }
    return ticket;
  }

  async updateTicket(ticketId: string, ticketData: Partial<ITicket>): Promise<ITicket> {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new AppError('Ticket not found', 404);
    }

    Object.assign(ticket, ticketData);
    return await ticket.save();
  }

  async deleteTicket(ticketId: string): Promise<void> {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new AppError('Ticket not found', 404);
    }

    await ticket.deleteOne();
  }

  async getProjectTickets(projectId: string): Promise<ITicket[]> {
    return await Ticket.find({ projectId })
      .populate('reporterId', 'name email')
      .populate('assigneeId', 'name email')
      .sort({ createdAt: -1 });
  }

  async addComment(ticketId: string, userId: string, content: string): Promise<ITicket> {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new AppError('Ticket not found', 404);
    }

    ticket.comments.push({
      content,
      userId: new mongoose.Types.ObjectId(userId),
      createdAt: new Date()
    });

    return await ticket.save();
  }

  async updateStatus(ticketId: string, status: ITicket['status']): Promise<ITicket> {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new AppError('Ticket not found', 404);
    }

    ticket.status = status;
    return await ticket.save();
  }

  async assignTicket(ticketId: string, assigneeId: string): Promise<ITicket> {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new AppError('Ticket not found', 404);
    }

    ticket.assigneeId = new mongoose.Types.ObjectId(assigneeId);
    return await ticket.save();
  }

  async addAttachment(ticketId: string, userId: string, filename: string, path: string): Promise<ITicket> {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new AppError('Ticket not found', 404);
    }

    ticket.attachments.push({
      filename,
      path,
      uploadedBy: new mongoose.Types.ObjectId(userId)
    });

    return await ticket.save();
  }
} 