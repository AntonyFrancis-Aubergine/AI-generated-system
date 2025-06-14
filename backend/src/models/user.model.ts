import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { ROLES } from '../utils/constants';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: string;
  teamId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true
  },
  password: { 
    type: String, 
    required: true,
    minlength: 8
  },
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  role: { 
    type: String, 
    required: true, 
    enum: Object.values(ROLES)
  },
  teamId: {
    type: Schema.Types.ObjectId,
    ref: 'Team'
  }
}, {
  timestamps: true
});

// Add methods
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Pre-save middleware for password hashing
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Index for faster queries
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ teamId: 1 });

export const User = mongoose.model<IUser>('User', userSchema); 