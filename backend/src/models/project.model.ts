import mongoose from 'mongoose';

export interface IBoardColumn {
  name: string;
  order: number;
  tickets: mongoose.Types.ObjectId[];
}

export interface IProject {
  name: string;
  description?: string;
  teamId: mongoose.Types.ObjectId;
  boardColumns: IBoardColumn[];
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true
  },
  boardColumns: [{
    name: {
      type: String,
      required: true
    },
    order: {
      type: Number,
      required: true
    },
    tickets: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket'
    }]
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export const Project = mongoose.model<IProject>('Project', projectSchema); 