import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export function validate(
  schema: Joi.ObjectSchema<any>,
  from: "body" | "param" | "query"
) {
  return [
    async (req: Request, res: Response, next: NextFunction) => {
      let validationSchema = null;
      if (from === "body") validationSchema = req.body;
      if (from === "param") validationSchema = req.params;
      if (from === "query") validationSchema = req.query;
      const validation = schema.validate(validationSchema);
      if (validation?.error) {
        let errorDetails = validation.error.details.map((x: any) => x.message);
        res.status(400).send(errorDetails);
        return;
      }
      next();
    },
  ];
}
