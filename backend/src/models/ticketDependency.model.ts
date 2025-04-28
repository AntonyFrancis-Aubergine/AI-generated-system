import mongoose, { Document, Schema } from 'mongoose';

export interface ITicketDependency extends Document {
  ticketId: mongoose.Types.ObjectId;
  dependentTicketId: mongoose.Types.ObjectId;
  type: 'blocks' | 'isBlockedBy';
  createdAt: Date;
}

const ticketDependencySchema = new Schema<ITicketDependency>({
  ticketId: {
    type: Schema.Types.ObjectId,
    ref: 'Ticket',
    required: true
  },
  dependentTicketId: {
    type: Schema.Types.ObjectId,
    ref: 'Ticket',
    required: true
  },
  type: {
    type: String,
    enum: ['blocks', 'isBlockedBy'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for faster queries
ticketDependencySchema.index({ ticketId: 1, type: 1 });
ticketDependencySchema.index({ dependentTicketId: 1, type: 1 });

// Prevent circular dependencies
ticketDependencySchema.pre('save', async function(next) {
  if (this.ticketId.equals(this.dependentTicketId)) {
    throw new Error('A ticket cannot depend on itself');
  }
  next();
});

export const TicketDependency = mongoose.model<ITicketDependency>('TicketDependency', ticketDependencySchema); 