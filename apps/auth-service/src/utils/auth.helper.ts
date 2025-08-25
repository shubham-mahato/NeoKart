import { ValidationError } from "@packages/error-handler";
import crypto from "crypto";
import redis from "@packages/libs/redis";
import { sendEmail } from "./sendMail";
import { NextFunction, Request, Response } from "express";
import prisma from "@packages/libs/prisma";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const validRegistrationData = (
  data: any,
  userType: "user" | "seller"
) => {
  const { name, email, password, phone_number, country } = data;
  if (
    !name ||
    !email ||
    !password ||
    (userType === "seller" && (!phone_number || !country))
  ) {
    throw new ValidationError(`Missing required Fields`);
  }
  if (!emailRegex.test(email)) {
    throw new ValidationError("Invalid email format!");
  }
};

export const checkOtpRestrictions = async (
  email: string,
  next: NextFunction
) => {
  if (await redis.get(`otp_lock:${email}`)) {
    return next(
      new ValidationError(
        "Account locked due to multiple failed attempts! Try Again after 30 minutes"
      )
    );
  }
  if (await redis.get(`otp_spam_lock:${email}`)) {
    return next(
      new ValidationError(
        "Too many OTP request! Please wait 1Hr before requesting again."
      )
    );
  }
  if (await redis.get(`otp_cooldown:${email}`)) {
    return next(
      new ValidationError("Please wait 1Min before requesting a new OTP!")
    );
  }
};

export const trackOtpRequests = async (email: string, next: NextFunction) => {
  const otpRequestKey = `otp_request_count:${email}`;
  let otpRequests = parseInt((await redis.get(otpRequestKey)) || "0");
  if (otpRequests >= 2) {
    await redis.set(`otp_spam_lock:${email}`, "locked", "EX", 3600); //Locked for 1 hr
    return next(
      new ValidationError(
        "Too many OTP requests. Please wait for 1Hr before requesting again"
      )
    );
  }
  await redis.set(otpRequestKey, otpRequests + 1, "EX", 3600); //Track Request for 1 Hr
};

export const sendOtp = async (
  name: string,
  email: string,
  template: string
) => {
  const otp = crypto.randomInt(1000, 9999).toString();
  await sendEmail(email, "Verify You Email", template, { name, otp });
  await redis.set(`otp:${email}`, otp, "EX", 300);
  await redis.set(`otp_cooldown:${email}`, "true", "EX", 60);
};

export const verifyOtp = async (
  email: string,
  otp: string,
  next: NextFunction
) => {
  const storeOtp = await redis.get(`otp:${email}`);
  if (!storeOtp) {
    throw new ValidationError("Invalid or Expired OTP!");
  }

  const failedAttemptsKey = `otp_attempts:${email}`;
  const failedAttempts = parseInt((await redis.get(failedAttemptsKey)) || "0");
  if (storeOtp !== otp) {
    if (failedAttempts >= 2) {
      await redis.set(`otp_lock:${email}`, "locked", "EX", 1800); //Lock for 30mins
      await redis.del(`otp:${email}`, failedAttemptsKey);
      throw new ValidationError(
        "Too many failed Attempts! Now your Account is locked for 30 minutes."
      );
    }
    await redis.set(failedAttemptsKey, failedAttempts + 1, "EX", 300);
    throw new ValidationError(
      `Incorrect OTP.${2 - failedAttempts} attempts left.`
    );
  }
  await redis.del(`otp:${email}`, failedAttemptsKey);
};

export const handleForgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
  userType: "user" | "seller"
) => {
  try {
    const { email } = req.body;
    if (!email) throw new ValidationError("Email is required");
    //find the user or seller

    const user =
      userType === "user" &&
      (await prisma.users.findUnique({ where: { email } }));
    if (!user) throw new ValidationError(`${userType} not found`);
    //Check otp restriction
    await checkOtpRestrictions(email, next);
    await trackOtpRequests(email, next);
    //Generate OTP and send Email
    await sendOtp(email, user.name, "forgot-password-user-mail");
    res.status(200).json({
      message: "OTP sent to email",
    });
  } catch (error) {
    next(error);
  }
};

export const verifyUserForgotPasswordOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) throw new ValidationError("Email and otp required");
    await verifyOtp(email, otp, next);
    res.status(200).json({
      message: "OTP verified.You can now reset your password",
    });
  } catch (error) {
    next(error);
  }
};
