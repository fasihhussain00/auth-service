import { NextFunction, Request, Response } from "express";
import { appRepo } from "../orm/repo";

const protectedCorsRoutes = ["/api/auth/login", "/api/auth/register"];

export const customCorsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const origin = req.headers["origin"];
  if (!protectedCorsRoutes.includes(req.path)) {
    res.header("Access-Control-Allow-Origin", origin);
    return next();
  }
  const apiKey = req.headers["x-api-key"] as string;
  const apiSecret = req.headers["x-api-secret"] as string;
  const app = await appRepo.findOne({
    where: { key: apiKey, secret: apiSecret },
    select: ["corsOrigins"],
  });
  const allowedOrigins = app?.corsOrigins ?? [];
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Credentials", "true");
  }
  next();
};
