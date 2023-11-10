import express from "express";
import { catchError } from "../middleware/error";
import accountRegisterSchema from "../validators/account";
import { validate } from "../middleware/validation";
import { registerAccount } from "../controllers/account";

const router = express.Router();

router.post(
  "/accounts/register",
  validate(accountRegisterSchema, "body"),
  catchError(registerAccount)
);
export default router;
