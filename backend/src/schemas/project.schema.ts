import * as Joi from 'joi';

export const projectSchema = Joi.object({
  name: Joi.string().required().trim().min(2).max(100),
  description: Joi.string().required().trim().min(10),
  managerId: Joi.string().hex().length(24).required(),
  teamMembers: Joi.array().items(Joi.string().hex().length(24)),
  status: Joi.string().valid('active', 'completed', 'on_hold'),
  startDate: Joi.date(),
  endDate: Joi.date().min(Joi.ref('startDate'))
});

export const updateProjectSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),
  description: Joi.string().trim().min(10),
  managerId: Joi.string().hex().length(24),
  teamMembers: Joi.array().items(Joi.string().hex().length(24)),
  status: Joi.string().valid('active', 'completed', 'on_hold'),
  startDate: Joi.date(),
  endDate: Joi.date().min(Joi.ref('startDate'))
});

export const addTeamMemberSchema = Joi.object({
  userId: Joi.string().hex().length(24).required()
}); 