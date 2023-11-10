import { NextFunction, Request, Response } from "express";
import { appendFileSync } from "fs";
import { QueryFailedError } from "typeorm";

const queryFailedMessages = {
  account_pk: "some error while registering account, please check fields",
  app_pk: "some error while registering app, please check fields",
  auth_pk: "some error while registering auth, please check fields",
  user_pk: "some error while registering user, please check fields",
  account_app_fk: "Account Doesn't exist",
  app_auth_fk: "App Doesn't exist",
  app_user_fk: "App Doesn't exist",
  app_auth_uk: "App already has this auth type registered",
  app_user_uk: "App already has this user registered",
};

export const catchError =
  (endpoint: Function) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await endpoint(req, res, next);
      return result;
    } catch (error: any) {
      if (error instanceof QueryFailedError) {
        const matchedErrorKeys = Object.keys(queryFailedMessages).filter(
          (key) => error.message.includes(key)
        );

        if (matchedErrorKeys.length) {
          const messages = matchedErrorKeys.map(
            (key) => queryFailedMessages[key]
          );
          return sendResponse(res, 4054, messages[0]);
        }
        return sendResponse(
          res,
          Number(error.driverError.code),
          error.driverError
        );
      }
      console.log(error)
      await sendErrorResponse(res);
    }
  };


async function sendResponse(
  res: Response,
  status: number,
  message: string
): Promise<void> {
  res.status(400).send({ status: status, message: message });
}

async function sendErrorResponse(res: Response): Promise<void> {
  res.status(500).send({ status: 500, message: "some error occured" });
}
