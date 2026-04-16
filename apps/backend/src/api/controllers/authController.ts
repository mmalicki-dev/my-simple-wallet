import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { randomBytes } from "node:crypto";
import mongoose from "mongoose";
import { UserModel, CategoryModel } from "../../models/index.js";
import env from "../../config/env.js";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../../config/email.js";
import { validate } from "../validators/authValidator.js";
import { asyncHandler, AppError, ok, created } from "../../lib/index.js";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "shared";
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

  created(res);
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

  await CategoryModel.insertMany(
    DEFAULT_CATEGORIES.map((cat) => ({ ...cat, user: user._id })),
  );

  ok(res, undefined, "Email verified successfully");
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

  ok(res, { token, user: { id: user._id, email: user.email, name: user.name } }, "Logged in successfully");
});

export const forgotPassword: RequestHandler = asyncHandler(async (req, res) => {
  const result = validate(forgotPasswordSchema, req.body);
  if (!result.success) throw new AppError(result.error, 400);

  const user = await UserModel.findOne({ email: result.data.email });

  // Always respond the same way to prevent email enumeration
  if (!user) {
    ok(res, undefined, "If that email exists, a reset link has been sent");
    return;
  }

  const resetToken = randomBytes(32).toString("hex");
  user.passwordResetToken = resetToken;
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save();

  await sendPasswordResetEmail(result.data.email, user.name, resetToken);

  ok(res, undefined, "If that email exists, a reset link has been sent");
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

  ok(res, undefined, "Password reset successfully");
});

export const getMe: RequestHandler = (req, res) => {
  ok(res, req.user);
};
