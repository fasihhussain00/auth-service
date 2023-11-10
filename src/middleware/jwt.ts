import jwt from "jsonwebtoken";
import { Response, NextFunction } from "express";
import { authRepo, userRepo } from "../orm/repo";
import { AppAuthRequest, JWTAuthRequest } from "./types";
import { AuthType, JwtAuthConfig } from "../orm/entities/types";
import JwtAuth from "../auth/jwt";

export const jwtAuthorize = async (
  req: JWTAuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  try {
    const jwtAuth = await authRepo.findOne({
      where: { app: { id: req.clientApp.id }, type: AuthType.JWT },
    });
    const publicKey = (jwtAuth.config as JwtAuthConfig).publicKey;
    const decoded = jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
    }) as any;
    const user = await userRepo.findOne({ where: { id: decoded.user.id } });
    if (!user) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const generateToken = async (
  req: AppAuthRequest,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  const jwtAuth = await authRepo.findOne({
    where: { type: AuthType.JWT, app: { id: req.clientApp.id } },
  });
  if (!jwtAuth) {
    return res.status(401).send("Jwt auth is not registered for this app");
  }
  const token = new JwtAuth(jwtAuth.config as JwtAuthConfig).sign(
    { user },
    "10d"
  );
  req.authInfo = token;
  next();
};

export const sendToken = (config: ITokenSendResponseConfig) => {
  return async (req: AppAuthRequest, res: Response) => {
    const token = req.authInfo;
    const user = req.user;
    if (config.cookie) {
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
    }
    if (config.redirect) {
      return res.redirect(`${req["redirectUri"]}?token=${token}`);
    }
    res.status(200).send({ user, token });
  };
};

interface ITokenSendResponseConfig {
  cookie?: boolean;
  redirect?: boolean;
}
