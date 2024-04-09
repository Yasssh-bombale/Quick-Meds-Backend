import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

const handleValidationError = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

export const validateUserSignUpRequest = [
  body("username").isString().notEmpty().withMessage("username is required"),
  body("email").isString().notEmpty().withMessage("email is required"),
  body("password").isString().notEmpty().withMessage("password is required"),
  handleValidationError,
];
export const validateUserSignInRequest = [
  body("email").isString().notEmpty().withMessage("email is required"),
  body("password").isString().notEmpty().withMessage("password is required"),
  handleValidationError,
];
