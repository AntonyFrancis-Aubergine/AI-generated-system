import express from 'express';
import { ProjectController } from '../../controllers/project.controller';

const router = express.Router();
const projectController = new ProjectController();

// Create a new project
router.post('/', projectController.createProject);

// Get a project by ID
router.get('/:projectId', projectController.getProject);

// Update a project
router.put('/:projectId', projectController.updateProject);

// Delete a project
router.delete('/:projectId', projectController.deleteProject);

// Get projects by team
router.get('/team/:teamId', projectController.getProjectsByTeam);

// Update board columns
router.put('/:projectId/columns', projectController.updateBoardColumns);

export default router; 