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

export const magicLinkSchema = Joi.object().keys({
  email: Joi.string().email().required(),
  signUpUri: Joi.string().uri().optional().allow(null),
  loginPageUri: Joi.string().uri().required(),
  failureUri: Joi.string().uri().required(),
});
