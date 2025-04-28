import express from 'express';
import { TicketAdvancedController } from '../../controllers/ticketAdvanced.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = express.Router();
const ticketAdvancedController = new TicketAdvancedController();

// Apply authentication middleware to all routes
router.use(authenticate);

// Advanced Search
router.get('/search', ticketAdvancedController.searchTickets);

// Ticket History
router.get('/:ticketId/history', ticketAdvancedController.getTicketHistory);

// Ticket Dependencies
router.post('/:ticketId/dependencies', ticketAdvancedController.addDependency);
router.get('/:ticketId/dependencies', ticketAdvancedController.getDependencies);

// Advanced Reporting
router.get('/project/:projectId/report', ticketAdvancedController.generateReport);

export default router; 