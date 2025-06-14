import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './user.model';

export interface ITicketComment {
  content: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
}

export interface ITicketAttachment {
  filename: string;
  path: string;
  uploadedBy: mongoose.Types.ObjectId;
}

export interface ITicket extends Document {
  title: string;
  description: string;
  projectId: mongoose.Types.ObjectId;
  reporterId: mongoose.Types.ObjectId;
  assigneeId?: mongoose.Types.ObjectId;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  type: 'bug' | 'feature' | 'task' | 'improvement';
  comments: ITicketComment[];
  attachments: ITicketAttachment[];
  createdAt: Date;
  updatedAt: Date;
}

const ticketSchema = new Schema<ITicket>({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 10
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  reporterId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assigneeId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'resolved', 'closed'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  type: {
    type: String,
    enum: ['bug', 'feature', 'task', 'improvement'],
    required: true
  },
  comments: [{
    content: {
      type: String,
      required: true,
      trim: true
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  attachments: [{
    filename: {
      type: String,
      required: true
    },
    path: {
      type: String,
      required: true
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }]
}, {
  timestamps: true
});

// Indexes for faster queries
ticketSchema.index({ projectId: 1, status: 1 });
ticketSchema.index({ assigneeId: 1, status: 1 });
ticketSchema.index({ reporterId: 1 });

export const Ticket = mongoose.model<ITicket>('Ticket', ticketSchema); 