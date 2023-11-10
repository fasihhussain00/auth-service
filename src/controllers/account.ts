import { Request, Response } from "express";
import { accountRepo } from "../orm/repo";
import { Account } from "../orm/entities/account";
import { randString } from "../utils/random";
export const registerAccount = async (req: Request, res: Response) => {
  const account = accountRepo.create(req.body as Account);
  account.username = randString({ length: 8, alphaNumeric: true });
  const password = randString({
    length: 12,
    alphaNumeric: true,
    specialChars: true,
  });
  account.password = password;
  const savedAccount = await accountRepo.save(account);
  res.status(201).send({ ...savedAccount, accountPassword: password });
};
