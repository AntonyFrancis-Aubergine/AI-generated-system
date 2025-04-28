import mongoose, { Document, Schema } from 'mongoose';

export interface IPermission extends Document {
  name: string;
  description: string;
  module: string;
  action: string;
  createdAt: Date;
  updatedAt: Date;
}

const permissionSchema = new Schema<IPermission>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  module: {
    type: String,
    required: true,
    enum: [
      'users',
      'projects',
      'tickets',
      'sprints',
      'teams',
      'roles',
      'permissions'
    ]
  },
  action: {
    type: String,
    required: true,
    enum: [
      'create',
      'read',
      'update',
      'delete',
      'manage',
      'assign',
      'approve'
    ]
  }
}, {
  timestamps: true
});

// Index for faster queries
permissionSchema.index({ module: 1, action: 1 }, { unique: true });

export const Permission = mongoose.model<IPermission>('Permission', permissionSchema); 