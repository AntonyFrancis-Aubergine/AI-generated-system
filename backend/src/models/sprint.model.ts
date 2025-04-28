import mongoose, { Document, Schema } from 'mongoose';

export interface ISprint extends Document {
  name: string;
  projectId: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  goal: string;
  velocity: number;
  tickets: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const sprintSchema = new Schema<ISprint>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['planned', 'active', 'completed', 'cancelled'],
    default: 'planned'
  },
  goal: {
    type: String,
    required: true,
    trim: true
  },
  velocity: {
    type: Number,
    default: 0
  },
  tickets: [{
    type: Schema.Types.ObjectId,
    ref: 'Ticket'
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
sprintSchema.index({ projectId: 1, status: 1 });
sprintSchema.index({ startDate: 1, endDate: 1 });
sprintSchema.index({ status: 1 });

// Validate that endDate is after startDate
sprintSchema.pre('save', function(next) {
  if (this.endDate <= this.startDate) {
    throw new Error('End date must be after start date');
  }
  next();
});

// Validate that sprint dates don't overlap with other active sprints
sprintSchema.pre('save', async function(next) {
  if (this.status === 'active') {
    const overlappingSprint = await mongoose.model('Sprint').findOne({
      projectId: this.projectId,
      status: 'active',
      _id: { $ne: this._id },
      $or: [
        { startDate: { $lte: this.endDate }, endDate: { $gte: this.startDate } },
        { startDate: { $gte: this.startDate, $lte: this.endDate } }
      ]
    });

    if (overlappingSprint) {
      throw new Error('Cannot have overlapping active sprints');
    }
  }
  next();
});

export const Sprint = mongoose.model<ISprint>('Sprint', sprintSchema); 