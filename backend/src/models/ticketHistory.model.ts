import mongoose, { Document, Schema } from 'mongoose';

export interface ITicketHistory extends Document {
  ticketId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  action: string;
  changes: any;
  timestamp: Date;
}

const ticketHistorySchema = new Schema<ITicketHistory>({
  ticketId: {
    type: Schema.Types.ObjectId,
    ref: 'Ticket',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true
  },
  changes: {
    type: Schema.Types.Mixed,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
ticketHistorySchema.index({ ticketId: 1, timestamp: -1 });

export const TicketHistory = mongoose.model<ITicketHistory>('TicketHistory', ticketHistorySchema); 