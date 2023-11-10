import Joi from "joi";

export const userRegisterSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().optional().allow(null),
  username: Joi.string().required().optional().allow(null),
  password: Joi.string().min(3).required(),
  metadata: Joi.object().optional().allow(null),
});

