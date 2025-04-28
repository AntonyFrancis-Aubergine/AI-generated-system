import { Router } from 'express';
import { 
  createTeam, 
  getTeam, 
  updateTeam, 
  deleteTeam,
  addTeamMember,
  removeTeamMember,
  getTeamMembers,
  getTeamProjects
} from '../../controllers/team.controller';
import { validate } from '../../utils/validator';
import { 
  createTeamValidation, 
  updateTeamValidation,
  addTeamMemberValidation
} from '../../validators/team.validator';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

// Apply authentication middleware to all routes
router.use(authenticate);

// Team CRUD routes
router.post('/', validate(createTeamValidation), createTeam);
router.get('/:teamId', getTeam);
router.put('/:teamId', validate(updateTeamValidation), updateTeam);
router.delete('/:teamId', deleteTeam);

// Team member management routes
router.post('/:teamId/members', validate(addTeamMemberValidation), addTeamMember);
router.delete('/:teamId/members/:userId', removeTeamMember);
router.get('/:teamId/members', getTeamMembers);

// Team projects routes
router.get('/:teamId/projects', getTeamProjects);

export default router; 