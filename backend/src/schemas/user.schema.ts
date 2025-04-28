import * as Joi from 'joi';

export const userSchema = Joi.object({
  name: Joi.string().required().trim().min(2).max(50),
  email: Joi.string().required().email().trim(),
  password: Joi.string().required().min(8),
  role: Joi.string().hex().length(24)
});

export const updateUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50),
  email: Joi.string().email().trim(),
  password: Joi.string().min(8),
  role: Joi.string().hex().length(24)
});

export const loginSchema = Joi.object({
  email: Joi.string().required().email().trim(),
  password: Joi.string().required()
}); 