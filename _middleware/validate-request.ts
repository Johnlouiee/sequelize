import { Request, NextFunction } from "express";
import { Schema } from "joi";

const validateRequest = (req: Request, next: NextFunction, schema: Schema): void => {
  const { error } = schema.validate(req.body);
  if (error) {
    next(`Validation error: ${error.details.map((x) => x.message).join(", ")}`);
  } else {
    next();
  }
};

export default validateRequest;
