import { Role, IRole } from '../models/role.model';
import { Permission } from '../models/permission.model';
import { AppError } from '../utils/errorHandler';
import mongoose from 'mongoose';

export const createRole = async (roleData: Partial<IRole>): Promise<IRole> => {
  const role = new Role(roleData);
  return await role.save();
};

export const getRoleById = async (roleId: string): Promise<IRole> => {
  const role = await Role.findById(roleId).populate('permissions');
  if (!role) {
    throw new AppError('Role not found', 404);
  }
  return role;
};

export const getAllRoles = async (): Promise<IRole[]> => {
  return await Role.find().populate('permissions');
};

export const updateRole = async (roleId: string, roleData: Partial<IRole>): Promise<IRole> => {
  const role = await Role.findById(roleId);
  if (!role) {
    throw new AppError('Role not found', 404);
  }

  // Prevent updating default status if it's the only default role
  if (roleData.isDefault === false && role.isDefault) {
    const defaultRolesCount = await Role.countDocuments({ isDefault: true });
    if (defaultRolesCount <= 1) {
      throw new AppError('Cannot remove default status from the only default role', 400);
    }
  }

  Object.assign(role, roleData);
  return await role.save();
};

export const deleteRole = async (roleId: string): Promise<void> => {
  const role = await Role.findById(roleId);
  if (!role) {
    throw new AppError('Role not found', 404);
  }

  if (role.isDefault) {
    throw new AppError('Cannot delete default role', 400);
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