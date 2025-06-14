import { Types } from 'mongoose';
import { Role, IRole } from '../models/role.model';
import { Permission } from '../models/permission.model';
import { AppError } from '../utils/errorHandler';
import mongoose from 'mongoose';
import { ROLE_MESSAGES } from '../utils/messages';

export const createRole = async (roleData: {
  name: string;
  description: string;
  permissions: string[];
}): Promise<IRole> => {
  try {
    const role = await Role.create(roleData);
    return role;
  } catch (error) {
    if ((error as any).code === 11000) {
      throw new AppError(ROLE_MESSAGES.NAME_EXISTS, 400);
    }
    throw error;
  }
};

export const getRoleById = async (roleId: string): Promise<IRole | null> => {
  return await Role.findById(roleId);
};

export const getAllRoles = async (): Promise<IRole[]> => {
  return await Role.find();
};

export const updateRole = async (
  roleId: string,
  roleData: {
    name?: string;
    description?: string;
    permissions?: string[];
  }
): Promise<IRole | null> => {
  try {
    const role = await Role.findByIdAndUpdate(
      roleId,
      { $set: roleData },
      { new: true }
    );
    return role;
  } catch (error) {
    if ((error as any).code === 11000) {
      throw new AppError(ROLE_MESSAGES.NAME_EXISTS, 400);
    }
    throw error;
  }
};

export const deleteRole = async (roleId: string): Promise<void> => {
  const role = await Role.findById(roleId);
  if (!role) {
    throw new AppError(ROLE_MESSAGES.NOT_FOUND, 404);
  }
  if (role.isDefault) {
    throw new AppError(ROLE_MESSAGES.CANNOT_DELETE_DEFAULT, 400);
  }
  await role.deleteOne();
};

export const assignPermissions = async (roleId: string, permissionIds: string[]): Promise<IRole> => {
  const role = await Role.findById(roleId);
  if (!role) {
    throw new AppError('Role not found', 404);
  }

  // Convert string IDs to ObjectId
  const objectIds = permissionIds.map(id => new mongoose.Types.ObjectId(id));

  // Verify all permissions exist
  const permissions = await Permission.find({ _id: { $in: objectIds } });
  if (permissions.length !== permissionIds.length) {
    throw new AppError('One or more permissions not found', 404);
  }

  role.permissions = objectIds;
  return await role.save();
};

export const getDefaultRole = async (): Promise<IRole> => {
  const role = await Role.findOne({ isDefault: true }).populate('permissions');
  if (!role) {
    throw new AppError('No default role found', 404);
  }
  return role;
};

export const addPermissionsToRole = async (
  roleId: string,
  permissionIds: string[]
): Promise<IRole | null> => {
  const role = await Role.findById(roleId);
  if (!role) {
    throw new AppError(ROLE_MESSAGES.NOT_FOUND, 404);
  }
  const objectIds = permissionIds.map(id => new Types.ObjectId(id));
  role.permissions = [...new Set([...role.permissions, ...objectIds])];
  await role.save();
  return role;
};

export const removePermissionsFromRole = async (
  roleId: string,
  permissionIds: string[]
): Promise<IRole | null> => {
  const role = await Role.findById(roleId);
  if (!role) {
    throw new AppError(ROLE_MESSAGES.NOT_FOUND, 404);
  }
  const objectIds = permissionIds.map(id => new Types.ObjectId(id));
  role.permissions = role.permissions.filter(
    permission => !objectIds.some(id => id.equals(permission))
  );
  await role.save();
  return role;
}; 