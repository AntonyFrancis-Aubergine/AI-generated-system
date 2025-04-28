import Joi from 'joi';
export const ticketSchema = Joi.object({
  title: Joi.string().required().trim().min(3).max(100),
  description: Joi.string().required().trim().min(10),
  projectId: Joi.string().hex().length(24).required(),
  status: Joi.string().valid('open', 'in_progress', 'resolved', 'closed'),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent'),
  type: Joi.string().valid('bug', 'feature', 'task', 'improvement')
});

export const commentSchema = Joi.object({
  content: Joi.string().required().trim().min(1)
});

export const statusSchema = Joi.object({
  status: Joi.string().valid('open', 'in_progress', 'resolved', 'closed').required()
});

export const assignSchema = Joi.object({
  assigneeId: Joi.string().hex().length(24).required()
}); 