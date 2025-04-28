import express from 'express';
import { TicketController } from '../../controllers/ticket.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validator';
import { checkPermission } from '../../middleware/checkPermission';
import { ticketSchema, commentSchema, statusSchema, assignSchema } from '../../schemas/ticket.schema.js';

const router = express.Router();
const ticketController = new TicketController();

// Apply authentication middleware to all routes
router.use(authenticate);

// Ticket routes with permission checks
router.post('/', 
  checkPermission('tickets:create'),
  validate(ticketSchema), 
  ticketController.createTicket
);

router.get('/:ticketId', 
  checkPermission('tickets:read'),
  ticketController.getTicket
);

router.put('/:ticketId', 
  checkPermission('tickets:update'),
  validate(ticketSchema), 
  ticketController.updateTicket
);

router.delete('/:ticketId', 
  checkPermission('tickets:delete'),
  ticketController.deleteTicket
);

router.get('/project/:projectId', 
  checkPermission('tickets:read'),
  ticketController.getTicketsByProject
);

router.post('/:ticketId/comments', 
  checkPermission('tickets:update'),
  validate(commentSchema), 
  ticketController.addComment
);

router.put('/:ticketId/status', 
  checkPermission('tickets:update'),
  validate(statusSchema), 
  ticketController.updateStatus
);

router.put('/:ticketId/assign', 
  checkPermission('tickets:assign'),
  validate(assignSchema), 
  ticketController.assignTicket
);

export default router; 