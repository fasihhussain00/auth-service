import express from "express";
import { catchError } from "../middleware/error";
import appRegisterSchema from "../validators/app";
import { validate } from "../middleware/validation";
import { registerApp } from "../controllers/app";
import { accountAuthorize } from "../middleware/account";

const router = express.Router();

router.post(
  "/apps/register",
  validate(appRegisterSchema, "body"),
  accountAuthorize,
  catchError(registerApp)
);
export default router;
