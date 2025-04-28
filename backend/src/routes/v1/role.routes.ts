import express from 'express';
import {
  createRoleHandler,
  getRoleHandler,
  getAllRolesHandler,
  updateRoleHandler,
  deleteRoleHandler,
  assignPermissionsHandler,
  getDefaultRoleHandler
} from '../../controllers/role.controller';
import { authenticate } from '../../middleware/auth';
import { validate } from '../../middleware/validator';
import { roleSchema } from '../../schemas/role.schema';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Role routes
router.post('/', validate(roleSchema), createRoleHandler);
router.get('/', getAllRolesHandler);
router.get('/default', getDefaultRoleHandler);
router.get('/:roleId', getRoleHandler);
router.put('/:roleId', validate(roleSchema), updateRoleHandler);
router.delete('/:roleId', deleteRoleHandler);
router.post('/:roleId/permissions', assignPermissionsHandler);

export default router; 