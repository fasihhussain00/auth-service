import Joi from "joi";
import { AuthType } from "../orm/entities/types";

const authTypes = Object.values(AuthType);

export const authRegisterSchema = Joi.object().keys({
  type: Joi.string()
    .valid(...authTypes)
    .allow(null)
    .optional(),
  config: Joi.object()
    .when("authType", {
      is: AuthType.GOOGLE,
      then: Joi.object({
        clientId: Joi.string().required(),
        clientSecret: Joi.string().required(),
      }),
    })
    .concat(
      Joi.object().when("authType", {
        is: AuthType.APPLE,
        then: Joi.object({
          clientId: Joi.string().required(),
          teamId: Joi.string().required(),
          keyId: Joi.string().required(),
          privateKey: Joi.string().required(),
        }),
      })
    )
    .concat(
      Joi.object().when("authType", {
        is: AuthType.AZUREAD,
        then: Joi.object({
          clientId: Joi.string().required(),
          clientSecret: Joi.string().required(),
          tenantId: Joi.string().required(),
        }),
      })
    ),
  metadata: Joi.object().optional().allow(null),
});

export const loginSchema = Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export const ssoSchema = Joi.object()
  .keys({
    callbackUri: Joi.string().uri().required(),
    failureUri: Joi.string().uri().required(),
  })
  .unknown(true);

export const changePasswordSchema = Joi.object().keys({
  usernameOrEmail: Joi.string().required(),
  password: Joi.string().required(),
  newPassword: Joi.string().required(),
});

export const oAuthSchema = Joi.object({
  redirectUri: Joi.string().uri().required(),
  failureUri: Joi.string().uri().required(),
  userId: Joi.number().positive().required(),
});

export const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});
