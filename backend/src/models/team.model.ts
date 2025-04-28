import mongoose, { Document, Schema } from 'mongoose';
import { ROLES } from '../utils/constants';

export interface ITeamMember {
  userId: mongoose.Types.ObjectId;
  role: typeof ROLES[keyof typeof ROLES];
}

export interface ITeam extends Document {
  name: string;
  description: string;
  members: ITeamMember[];
  projects: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const teamSchema = new Schema<ITeam>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  members: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      required: true,
      enum: Object.values(ROLES)
    }
  }],
  projects: [{
    type: Schema.Types.ObjectId,
    ref: 'Project'
  }]
}, {
  timestamps: true
});

// Index for faster queries
teamSchema.index({ name: 1 }, { unique: true });

export const Team = mongoose.model<ITeam>('Team', teamSchema); 