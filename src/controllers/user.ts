import { Request, Response } from "express";
import { userRepo } from "../orm/repo";
import { User } from "../orm/entities/user";
import { AppAuthRequest, JWTAuthRequest } from "../middleware/types";

export const registerUser = async (req: AppAuthRequest, res: Response) => {
  const user = userRepo.create(req.body as User);
  if (!req.clientApp.allowedEmailHosts.includes(user.email.split("@").at(-1))) {
    res.status(400).json({
      message: "Email address of given email is not allowed by admin",
    });
    return;
  }
  user.app = req.clientApp;
  const savedUser = await userRepo.save(user);
  res.status(201).json(savedUser);
};

export const me = async (req: JWTAuthRequest, res: Response) => {
  const user = await userRepo.findOne({ where: { id: req.user.id } });
  res.status(201).json(user);
};
