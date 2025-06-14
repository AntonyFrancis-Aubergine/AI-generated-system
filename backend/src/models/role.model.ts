import mongoose, { Types } from 'mongoose';

export interface IRole {
  name: string;
  description: string;
  permissions: Types.ObjectId[];
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const roleSchema = new mongoose.Schema<IRole>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    permissions: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true,
      default: [],
      ref: 'Permission'
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent deletion of default roles
roleSchema.pre('deleteOne', async function(this: mongoose.Document & IRole) {
  if (this.isDefault) {
    throw new Error('Cannot delete default role');
  }
});

// Ensure at least one default role exists
roleSchema.post('deleteOne', async function(this: mongoose.Document & IRole) {
  const defaultRole = await Role.findOne({ isDefault: true });
  if (!defaultRole) {
    await Role.create({
      name: 'User',
      description: 'Default user role',
      permissions: ['read'],
      isDefault: true,
    });
  }
});

export const Role = mongoose.model<IRole>('Role', roleSchema); 