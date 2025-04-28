import { Ticket, ITicket } from '../models/ticket.model';
import { AppError } from '../utils/errorHandler';
import { Types } from 'mongoose';
import { TicketHistory } from '../models/ticketHistory.model';
import { TicketDependency } from '../models/ticketDependency.model';
import { NotificationService } from './notification.service';

export class TicketAdvancedService {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  // Advanced Search and Filtering
  async searchTickets(query: {
    searchTerm?: string;
    status?: string[];
    priority?: string[];
    type?: string[];
    assigneeId?: string;
    reporterId?: string;
    projectId?: string;
    labels?: string[];
    dateRange?: {
      startDate: Date;
      endDate: Date;
    };
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const {
      searchTerm,
      status,
      priority,
      type,
      assigneeId,
      reporterId,
      projectId,
      labels,
      dateRange,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = query;

    const filter: any = {};

    if (searchTerm) {
      filter.$or = [
        { title: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { 'comments.content': { $regex: searchTerm, $options: 'i' } }
      ];
    }

    if (status?.length) filter.status = { $in: status };
    if (priority?.length) filter.priority = { $in: priority };
    if (type?.length) filter.type = { $in: type };
    if (assigneeId) filter.assigneeId = new Types.ObjectId(assigneeId);
    if (reporterId) filter.reporterId = new Types.ObjectId(reporterId);
    if (projectId) filter.projectId = new Types.ObjectId(projectId);
    if (labels?.length) filter.labels = { $in: labels };
    if (dateRange) {
      filter.createdAt = {
        $gte: dateRange.startDate,
        $lte: dateRange.endDate
      };
    }

    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    return await Ticket.find(filter)
      .populate('projectId', 'name')
      .populate('assigneeId', 'name email')
      .populate('reporterId', 'name email')
      .sort(sort);
  }

  // Ticket History and Audit Trail
  async logTicketHistory(ticketId: string, userId: string, action: string, changes: any) {
    return await TicketHistory.create({
      ticketId: new Types.ObjectId(ticketId),
      userId: new Types.ObjectId(userId),
      action,
      changes,
      timestamp: new Date()
    });
  }

  async getTicketHistory(ticketId: string) {
    return await TicketHistory.find({ ticketId: new Types.ObjectId(ticketId) })
      .populate('userId', 'name email')
      .sort({ timestamp: -1 });
  }

  // Ticket Dependencies
  async addDependency(ticketId: string, dependentTicketId: string, type: 'blocks' | 'isBlockedBy') {
    const dependency = await TicketDependency.create({
      ticketId: new Types.ObjectId(ticketId),
      dependentTicketId: new Types.ObjectId(dependentTicketId),
      type
    });

    // Notify relevant users about the dependency
    await this.notificationService.createDependencyNotification(
      ticketId,
      dependentTicketId,
      type
    );

    return dependency;
  }

  async getDependencies(ticketId: string) {
    const blocking = await TicketDependency.find({
      ticketId: new Types.ObjectId(ticketId),
      type: 'blocks'
    }).populate('dependentTicketId');

    const blockedBy = await TicketDependency.find({
      dependentTicketId: new Types.ObjectId(ticketId),
      type: 'blocks'
    }).populate('ticketId');

    return {
      blocking,
      blockedBy
    };
  }

  // Advanced Reporting
  async generateTicketReport(projectId: string, dateRange: { startDate: Date; endDate: Date }) {
    const tickets = await Ticket.find({
      projectId: new Types.ObjectId(projectId),
      createdAt: {
        $gte: dateRange.startDate,
        $lte: dateRange.endDate
      }
    });

    const report = {
      totalTickets: tickets.length,
      byStatus: {},
      byPriority: {},
      byType: {},
      averageResolutionTime: 0,
      resolutionTimeByPriority: {},
      ticketsCreatedByDay: {},
      ticketsResolvedByDay: {}
    };

    tickets.forEach(ticket => {
      // Count by status
      report.byStatus[ticket.status] = (report.byStatus[ticket.status] || 0) + 1;
      
      // Count by priority
      report.byPriority[ticket.priority] = (report.byPriority[ticket.priority] || 0) + 1;
      
      // Count by type
      report.byType[ticket.type] = (report.byType[ticket.type] || 0) + 1;

      // Track creation dates
      const createdDate = ticket.createdAt.toISOString().split('T')[0];
      report.ticketsCreatedByDay[createdDate] = (report.ticketsCreatedByDay[createdDate] || 0) + 1;

      // If ticket is resolved, track resolution time and dates
      if (ticket.status === 'resolved' && ticket.updatedAt) {
        const resolvedDate = ticket.updatedAt.toISOString().split('T')[0];
        report.ticketsResolvedByDay[resolvedDate] = (report.ticketsResolvedByDay[resolvedDate] || 0) + 1;

        const resolutionTime = ticket.updatedAt.getTime() - ticket.createdAt.getTime();
        report.averageResolutionTime += resolutionTime;
        report.resolutionTimeByPriority[ticket.priority] = 
          (report.resolutionTimeByPriority[ticket.priority] || 0) + resolutionTime;
      }
    });

    // Calculate averages
    if (report.byStatus['resolved']) {
      report.averageResolutionTime /= report.byStatus['resolved'];
      Object.keys(report.resolutionTimeByPriority).forEach(priority => {
        report.resolutionTimeByPriority[priority] /= 
          (report.byPriority[priority] * (report.byStatus['resolved'] / tickets.length));
      });
    }

    return report;
  }
} 