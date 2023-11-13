import express from "express";
import { catchError } from "../middleware/error";
import { userRegisterSchema } from "../validators/user";
import { validate } from "../middleware/validation";
import { me, registerUser } from "../controllers/user";
import { appAuthorize } from "../middleware/app";
import { jwtAuthorize } from "../middleware/jwt";

const router = express.Router();

router.post(
  "/users/register",
  validate(userRegisterSchema, "body"),
  appAuthorize(false),
  catchError(registerUser)
);
router.get(
  "/users/me",
  appAuthorize(false),
  jwtAuthorize,
  catchError(me)
);
export default router;
