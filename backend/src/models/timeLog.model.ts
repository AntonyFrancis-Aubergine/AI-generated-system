import mongoose, { Document, Schema } from 'mongoose';

export interface ITimeLog extends Document {
  ticketId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  duration: number;
  date: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const timeLogSchema = new Schema<ITimeLog>({
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
  duration: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for faster queries
timeLogSchema.index({ ticketId: 1, userId: 1 });
timeLogSchema.index({ date: 1 });

export const TimeLog = mongoose.model<ITimeLog>('TimeLog', timeLogSchema); 