import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { randomBytes } from "node:crypto";
import mongoose from "mongoose";
import UserModel from "../../models/User.js";
import env from "../../config/env.js";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../../config/email.js";
import { validate } from "../validators/authValidator.js";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { AppError } from "../../lib/AppError.js";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "shared";
import Category from "../../models/Category.js";
import { DEFAULT_CATEGORIES } from "../../config/defaultCategories.js";

export const register: RequestHandler = asyncHandler(async (req, res) => {
  const result = validate(registerSchema, req.body);
  if (!result.success) throw new AppError(result.error, 400);

  const { email, name, password } = result.data;

  const verificationToken = randomBytes(32).toString("hex");

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [user] = await UserModel.create(
      [{ email, name, password, verificationToken }],
      { session },
    );
    await sendVerificationEmail(user.email, user.name, verificationToken);
    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }

  res.status(201).json({
    success: true,
    message:
      "Registered successfully. Please check your email to verify your account.",
  });
});

export const verifyEmail: RequestHandler = asyncHandler(async (req, res) => {
  const { token } = req.query;

  if (!token || typeof token !== "string")
    throw new AppError("Invalid or missing token", 400);

  const user = await UserModel.findOne({ verificationToken: token });
  if (!user) throw new AppError("Invalid or expired verification token", 400);

  user.isVerified = true;
  user.verificationToken = undefined;
  await user.save();

  await Category.insertMany(
    DEFAULT_CATEGORIES.map((cat) => ({ ...cat, user: user._id })),
  );

  res
    .status(200)
    .json({ success: true, message: "Email verified successfully" });
});

export const login: RequestHandler = asyncHandler(async (req, res) => {
  const result = validate(loginSchema, req.body);
  if (!result.success) throw new AppError(result.error, 400);

  const { email, password } = result.data;

  const user = await UserModel.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid credentials", 401);
  }

  if (!user.isVerified)
    throw new AppError("Please verify your email before logging in", 403);

  const token = jwt.sign(
    { userId: user._id, email: user.email },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    },
  );

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: { token, user: { id: user._id, email: user.email, name: user.name } },
  });
});

export const forgotPassword: RequestHandler = asyncHandler(async (req, res) => {
  const result = validate(forgotPasswordSchema, req.body);
  if (!result.success) throw new AppError(result.error, 400);

  const user = await UserModel.findOne({ email: result.data.email });

  // Always respond the same way to prevent email enumeration
  if (!user) {
    res
      .status(200)
      .json({
        success: true,
        message: "If that email exists, a reset link has been sent",
      });
    return;
  }

  const resetToken = randomBytes(32).toString("hex");
  user.passwordResetToken = resetToken;
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save();

  await sendPasswordResetEmail(result.data.email, user.name, resetToken);

  res
    .status(200)
    .json({
      success: true,
      message: "If that email exists, a reset link has been sent",
    });
});

export const resetPassword: RequestHandler = asyncHandler(async (req, res) => {
  const { token } = req.query;
  const result = validate(resetPasswordSchema, req.body);

  if (!token || typeof token !== "string")
    throw new AppError("Invalid or missing token", 400);
  if (!result.success) throw new AppError(result.error, 400);

  const user = await UserModel.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: new Date() },
  });

  if (!user) throw new AppError("Invalid or expired reset token", 400);

  user.password = result.data.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res
    .status(200)
    .json({ success: true, message: "Password reset successfully" });
});

export const getMe: RequestHandler = (req, res) => {
  res.status(200).json({ success: true, message: "OK", data: req.user });
};
