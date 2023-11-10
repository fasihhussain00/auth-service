import { Response, NextFunction } from "express";
import { appRepo } from "../orm/repo";
import { AppAuthRequest } from "./types";

export const appAuthorize = async (
  req: AppAuthRequest,
  res: Response,
  next: NextFunction
) => {
  let apiKey: string;
  let apiSecret: string;
  if (req.method === "GET") {
    apiKey = req.query?.apiKey as string;
    apiSecret = req.query?.apiSecret as string;
    if (!apiKey || !apiSecret) {
      return res.status(400).json({
        message:
          "apiKey and apiSecret is required in query in order to aquire this service",
      });
    }
  } else {
    apiKey = req.headers["x-api-key"] as string;
    apiSecret = req.headers["x-api-secret"] as string;
    if (!apiKey || !apiSecret) {
      return res.status(400).json({
        message:
          "X-API-KEY and X-API-SECRET is required in headers in order to aquire this service",
      });
    }
  }
  try {
    const app = await appRepo.findOne({
      where: { key: apiKey, secret: apiSecret },
    });
    if (!app)
      throw new Error("No app registered with the given API key and secret");
    req.clientApp = app;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
