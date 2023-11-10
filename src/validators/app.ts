import Joi from "joi";
import { NotificationType } from "../orm/entities/types";
const notificationTypes = Object.values(NotificationType);
const appRegisterSchema = Joi.object({
  name: Joi.string().alphanum().min(3).max(30).required(),
  corsOrigins: Joi.array().items(Joi.string().uri()).min(1).unique(),
  allowedEmailHosts: Joi.array().items(Joi.string().domain()),
  allowedHosts: Joi.array().items(Joi.string().domain()),
  magicLinkTemplate: Joi.string().optional().allow(null),
  resetPasswordTemplate: Joi.string().optional().allow(null),
  notificationType: Joi.string()
    .valid(...notificationTypes)
    .allow(null)
    .optional(),
  notificationConfig: Joi.object()
    .when("notificationType", {
      is: NotificationType.SendGrid,
      then: Joi.object({
        apiKey: Joi.string().required(),
        email: Joi.string().email().required(),
      }),
    })
    .concat(
      Joi.object().when("notificationType", {
        is: NotificationType.Twilio,
        then: Joi.object({
          accountSid: Joi.string().required(),
          authToken: Joi.string().required(),
          service: Joi.string().required(),
          sendgridApiKey: Joi.string().required(),
          sendgridEmail: Joi.string().required(),
        }),
      })
    ),
    metadata: Joi.object().optional().allow(null),
});

export default appRegisterSchema;
