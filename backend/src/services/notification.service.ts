import { Notification } from '../models/notification.model';
import { Types } from 'mongoose';
import { AppError } from '../utils/errorHandler';

export class NotificationService {
  async createNotification(userId: string, type: string, message: string, data: any = {}) {
    return await Notification.create({
      userId: new Types.ObjectId(userId),
      type,
      message,
      data,
      read: false,
      createdAt: new Date()
    });
  }

  async createDependencyNotification(ticketId: string, dependentTicketId: string, type: 'blocks' | 'isBlockedBy') {
    // Get the tickets to notify relevant users
    const tickets = await Promise.all([
      this.getTicketWithUsers(ticketId),
      this.getTicketWithUsers(dependentTicketId)
    ]);

    const [ticket, dependentTicket] = tickets;
    if (!ticket || !dependentTicket) {
      throw new AppError('One or both tickets not found', 404);
    }

    // Notify both assignees
    const notifications = [];
    if (ticket.assigneeId) {
      notifications.push(
        this.createNotification(
          ticket.assigneeId.toString(),
          'ticket_dependency',
          `Ticket ${ticket.title} ${type === 'blocks' ? 'blocks' : 'is blocked by'} ${dependentTicket.title}`,
          { ticketId, dependentTicketId, type }
        )
      );
    }

    if (dependentTicket.assigneeId) {
      notifications.push(
        this.createNotification(
          dependentTicket.assigneeId.toString(),
          'ticket_dependency',
          `Ticket ${dependentTicket.title} ${type === 'blocks' ? 'is blocked by' : 'blocks'} ${ticket.title}`,
          { ticketId, dependentTicketId, type }
        )
      );
    }

    return await Promise.all(notifications);
  }

  async getUnreadNotifications(userId: string) {
    return await Notification.find({
      userId: new Types.ObjectId(userId),
      read: false
    }).sort({ createdAt: -1 });
  }

  async markAsRead(notificationId: string, userId: string) {
    return await Notification.findOneAndUpdate(
      {
        _id: new Types.ObjectId(notificationId),
        userId: new Types.ObjectId(userId)
      },
      { read: true },
      { new: true }
    );
  }

  async markAllAsRead(userId: string) {
    return await Notification.updateMany(
      {
        userId: new Types.ObjectId(userId),
        read: false
      },
      { read: true }
    );
  }

  private async getTicketWithUsers(ticketId: string) {
    return await Ticket.findById(ticketId)
      .populate('assigneeId', 'name email')
      .populate('reporterId', 'name email');
  }
} 