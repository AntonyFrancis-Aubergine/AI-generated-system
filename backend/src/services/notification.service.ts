import { Types } from 'mongoose';
import { Notification, INotification } from '../models/notification.model';
import { Ticket } from '../models/ticket.model';
import { AppError } from '../utils/errorHandler';
import { TICKET_MESSAGES } from '../utils/messages';

export class NotificationService {
  async createNotification(
    userId: string,
    type: string,
    message: string,
    data: any
  ): Promise<INotification> {
    return await Notification.create({
      userId: new Types.ObjectId(userId),
      type,
      message,
      data,
    });
  }

  async createTicketDependencyNotification(
    ticketId: string,
    dependentTicketId: string,
    type: 'blocks' | 'isBlockedBy'
  ): Promise<void> {
    const ticket = await this.getTicketWithUsers(ticketId);
    const dependentTicket = await this.getTicketWithUsers(dependentTicketId);

    if (!ticket) {
      throw new AppError(TICKET_MESSAGES.NOT_FOUND, 404);
    }

    if (!dependentTicket) {
      throw new AppError(TICKET_MESSAGES.NOT_FOUND, 404);
    }

    if (ticket.assigneeId) {
      await this.createNotification(
        ticket.assigneeId.toString(),
        'TICKET_DEPENDENCY',
        `Ticket ${ticket.title} ${type} ${dependentTicket.title}`,
        { ticketId, dependentTicketId, type }
      );
    }

    if (dependentTicket.assigneeId) {
      await this.createNotification(
        dependentTicket.assigneeId.toString(),
        'TICKET_DEPENDENCY',
        `Ticket ${dependentTicket.title} is ${type} by ${ticket.title}`,
        { ticketId, dependentTicketId, type }
      );
    }
  }

  async getNotifications(userId: string): Promise<INotification[]> {
    return await Notification.find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  async markAsRead(notificationId: string): Promise<INotification | null> {
    return await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );
  }

  async markAllAsRead(userId: string): Promise<void> {
    await Notification.updateMany(
      { userId: new Types.ObjectId(userId), read: false },
      { read: true }
    );
  }

  private async getTicketWithUsers(ticketId: string) {
    const ticket = await Ticket.findById(ticketId)
      .select('title assigneeId')
      .populate('assigneeId', 'name')
      .exec();
    
    if (!ticket) {
      throw new AppError(TICKET_MESSAGES.NOT_FOUND, 404);
    }
    
    return ticket;
  }
} 