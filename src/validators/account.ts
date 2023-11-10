import Joi from "joi";

const accountRegisterSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  metadata: Joi.object().optional().allow(null),
});

export default accountRegisterSchema;
