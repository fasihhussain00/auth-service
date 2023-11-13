import express from "express";
import {
  apple,
  appleCallback,
  authRegister,
  azureADCallback,
  azureAd,
  google,
  googleCallback,
  login,
} from "../controllers/auth";
import { catchError } from "../middleware/error";
import { validate } from "../middleware/validation";
import { authRegisterSchema, ssoSchema, loginSchema } from "../validators/auth";
import { appAuthorize } from "../middleware/app";
import { ssoDomainValidation } from "../middleware/sso";
import { generateToken, sendToken } from "../middleware/jwt";

const router = express.Router();

router.post(
  "/auth/register",
  appAuthorize,
  validate(authRegisterSchema, "body"),
  catchError(authRegister)
);
router.post(
  "/auth/login",
  appAuthorize,
  validate(loginSchema, "body"),
  catchError(login),
  generateToken,
  sendToken({ cookie: true })
);
router.get(
  "/auth/google",
  appAuthorize,
  validate(ssoSchema, "query"),
  ssoDomainValidation,
  catchError(google)
);
router.get(
  "/auth/google/callback",
  catchError(googleCallback),
  generateToken,
  sendToken({ cookie: true, redirect: true })
);
router.get(
  "/auth/microsoft",
  appAuthorize,
  validate(ssoSchema, "query"),
  ssoDomainValidation,
  catchError(azureAd)
);
router.get(
  "/auth/microsoft/callback",
  catchError(azureADCallback),
  generateToken,
  sendToken({ cookie: true, redirect: true })
);
router.get(
  "/auth/apple",
  appAuthorize,
  validate(ssoSchema, "query"),
  ssoDomainValidation,
  catchError(apple)
);
router.get(
  "/auth/apple/callback",
  catchError(appleCallback),
  generateToken,
  sendToken({ cookie: true, redirect: true })
);
export default router;
