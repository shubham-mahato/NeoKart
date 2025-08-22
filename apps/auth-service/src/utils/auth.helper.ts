import { ValidationError } from "../../../../packages/error-handler";
import crypto from "crypto";
import redis from "../../../../packages/libs/redis";
import { sendEmail } from "./sendMail";
import { NextFunction } from "express";

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
