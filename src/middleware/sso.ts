import { allowedDomain, getHosts } from "../utils/uri";
import { AppAuthRequest } from "./types";
import { NextFunction, Response } from "express";

export const ssoDomainValidation = async (
  req: AppAuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { callbackUri, failureUri } = req.query as any;
  try {
    const [callbackUriDomain, failureUriDomain] = getHosts([
      callbackUri,
      failureUri,
    ]);
    if (
      !allowedDomain(
        [callbackUriDomain, failureUriDomain],
        req.clientApp.allowedHosts
      )
    ) {
      return res
        .status(400)
        .send(
          "Given callbackUri or failureUri domain is not allowed for this app"
        );
    }
  } catch (error) {
    return res.status(400).send("Invalid callbackUri or failureUri");
  }
  next();
};
