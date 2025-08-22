import { NextFunction, Request, Response } from "express";
import { validRegistrationData } from "../utils/auth.helper";
import prisma from "../../../../packages/libs/prisma";
import { ValidationError } from "../../../../packages/error-handler";

//Register a new User

export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  validRegistrationData(req.body(), "user");
  const { name, email } = req.body;
  const existingUser = await prisma.users.findUnique({ where: email });

  if (existingUser) {
    return next(new ValidationError("User already exists with this email"));
  }
  await checkOtpRestrictions(email, next);
};
