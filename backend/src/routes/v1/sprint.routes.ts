import express from 'express';
import { SprintController } from '../../controllers/sprint.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../utils/validator';

const router = express.Router();
const sprintController = new SprintController();

// Apply authentication middleware to all routes
router.use(authenticate);

// Create a new sprint
router.post(
  '/',
  validate(SprintController.createSprintValidation),
  sprintController.createSprint
);

// Get a sprint by ID
router.get('/:sprintId', sprintController.getSprint);

// Update a sprint
router.put(
  '/:sprintId',
  validate(SprintController.updateSprintValidation),
  sprintController.updateSprint
);

// Delete a sprint
router.delete('/:sprintId', sprintController.deleteSprint);

// Get sprints by project
router.get('/project/:projectId', sprintController.getSprintsByProject);

// Ticket management in sprint
router.post('/:sprintId/tickets', sprintController.addTicketToSprint);
router.delete('/:sprintId/tickets', sprintController.removeTicketFromSprint);

// Sprint lifecycle
router.post('/:sprintId/start', sprintController.startSprint);
router.post('/:sprintId/complete', sprintController.completeSprint);

// Sprint metrics
router.get('/:sprintId/velocity', sprintController.calculateVelocity);

export default router; 