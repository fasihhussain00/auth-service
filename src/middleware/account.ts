import { Response, NextFunction } from "express";
import { accountRepo } from "../orm/repo";
import { AccountAuthRequest } from "./types";

export const accountAuthorize = async (
  req: AccountAuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    res.status(401).send("Unauthorized");
    return;
  }

  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "ascii"
  );
  const [username, password] = credentials.split(":");

  const account = await accountRepo.findOne({
    where: {
      username,
    },
  });

  if (!account || !account.passwordMatch(password)) {
    res.status(401).send("Unauthorized");
    return;
  }

  req.account = account;
  next();
};
