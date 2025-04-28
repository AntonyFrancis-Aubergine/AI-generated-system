import { Request, Response, NextFunction } from 'express';
import {
  createRole,
  getRoleById,
  getAllRoles,
  updateRole,
  deleteRole,
  assignPermissions,
  getDefaultRole
} from '../services/role.service';
import { generateResponse } from '../utils/responseGenerator';

export const createRoleHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const role = await createRole(req.body);
    generateResponse(res, 201, 'Role created successfully', role);
  } catch (error) {
    next(error);
  }
};

export const getRoleHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const role = await getRoleById(req.params.roleId);
    generateResponse(res, 200, 'Role retrieved successfully', role);
  } catch (error) {
    next(error);
  }
};

export const getAllRolesHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roles = await getAllRoles();
    generateResponse(res, 200, 'Roles retrieved successfully', roles);
  } catch (error) {
    next(error);
  }
};

export const updateRoleHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const role = await updateRole(req.params.roleId, req.body);
    generateResponse(res, 200, 'Role updated successfully', role);
  } catch (error) {
    next(error);
  }
};

export const deleteRoleHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteRole(req.params.roleId);
    generateResponse(res, 200, 'Role deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const assignPermissionsHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { permissionIds } = req.body;
    const role = await assignPermissions(req.params.roleId, permissionIds);
    generateResponse(res, 200, 'Permissions assigned successfully', role);
  } catch (error) {
    next(error);
  }
};

export const getDefaultRoleHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const role = await getDefaultRole();
    generateResponse(res, 200, 'Default role retrieved successfully', role);
  } catch (error) {
    next(error);
  }
}; 