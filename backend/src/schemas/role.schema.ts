import * as Joi from 'joi';

export const roleSchema = Joi.object({
  name: Joi.string().required().trim().min(2).max(50),
  description: Joi.string().required().trim().min(5).max(200),
  isDefault: Joi.boolean().default(false)
});

export const assignPermissionsSchema = Joi.object({
  permissionIds: Joi.array().items(Joi.string().hex().length(24)).required()
}); 