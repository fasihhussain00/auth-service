import { Response, NextFunction } from "express";
import { appRepo } from "../orm/repo";
import { AppAuthRequest } from "./types";

export const appAuthorize = (secretRequired: boolean = true) => {
  return async (req: AppAuthRequest, res: Response, next: NextFunction) => {
    let apiKey: string;
    let apiSecret: string;
    if (!secretRequired) {
      apiKey =
        (req.headers["x-api-key"] as string) ?? (req.query?.apiKey as string);
      if (!apiKey) {
        return res.status(400).json({
          message:
            'api key is required either with "X-API-KEY" key in headers or "apiKey" in query param',
        });
      }
    }
    if (secretRequired) {
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
        where: secretRequired
          ? { key: apiKey, secret: apiSecret }
          : { key: apiKey },
      });
      if (!app)
        throw new Error("No app registered with the given API key and secret");
      req.clientApp = app;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  };
};
