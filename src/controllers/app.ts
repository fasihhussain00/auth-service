import { Response } from "express";
import { appRepo, authRepo } from "../orm/repo";
import { App } from "../orm/entities/app";
import { randString } from "../utils/random";
import { AccountAuthRequest } from "../middleware/types";
import JwtAuth from "../auth/jwt";
import { AuthType } from "../orm/entities/types";

export const registerApp = async (req: AccountAuthRequest, res: Response) => {
  const app = appRepo.create(req.body as App);
  app.key = randString({ length: 30, alphaNumeric: true });
  app.secret = randString({ length: 35, alphaNumeric: true });
  app.account = req.account;
  const { publicKey, privateKey } = JwtAuth.generateKeyPair();
  app.auths = [
    authRepo.create({
      config: { publicKey, privateKey },
      type: AuthType.JWT,
    }),
  ];
  const savedApp = await appRepo.save(app);
  res.status(201).json(savedApp);
};
