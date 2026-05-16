import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { randomBytes, randomUUID } from "node:crypto";
import mongoose from "mongoose";
import { UserModel, CategoryModel } from "../../models/index.js";
import env from "../../config/env.js";
import {
  sendVerificationEmail,
  sendChangeEmailVerification,
  sendPasswordResetEmail,
} from "../../config/email.js";
import { validate } from "../validators/authValidator.js";
import { asyncHandler, AppError, ok, created } from "../../lib/index.js";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  CURRENCIES,
} from "../../../../../packages/shared/dist/index.js";
import { DEFAULT_CATEGORIES } from "../../config/defaultCategories.js";

function parseDuration(duration: string): number {
  const units: Record<string, number> = {
    s: 1000,
    m: 60000,
    h: 3600000,
    d: 86400000,
  };
  const match = /^(\d+)([smhd])$/.exec(duration);
  if (!match) throw new Error(`Invalid duration: ${duration}`);
  return Number(match[1]) * units[match[2]];
}

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

  if (result.data.rememberMe) {
    const refreshToken = jwt.sign(
      { userId: user._id, email: user.email },
      env.JWT_REFRESH_SECRET,
      {
        expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"],
      },
    );

    const expiresAt = new Date(
      Date.now() + parseDuration(env.JWT_REFRESH_EXPIRES_IN),
    );
    const deviceID = req.cookies.deviceID ?? randomUUID();
    const userAgent = req.headers["user-agent"] ?? "unknown";
    user.refreshTokens = [
      ...user.refreshTokens.filter(
        (t) => t.expiresAt > new Date() && t.deviceID !== deviceID,
      ),
      { token: refreshToken, expiresAt, deviceID, userAgent },
    ];
    await user.save();
    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .cookie("deviceID", deviceID, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        maxAge: 400 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      });
  }

  const accessToken = jwt.sign(
    { userId: user._id, email: user.email },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    },
  );

  ok(
    res,
    {
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        totalBalanceCurrency: user.totalBalanceCurrency,
      },
    },
    "Logged in successfully",
  );
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

export const updateProfile: RequestHandler = asyncHandler(async (req, res) => {
  const { name, totalBalanceCurrency } = req.body;

  const user = await UserModel.findById(req.user!.id);
  if (!user) throw new AppError("User not found", 404);

  if (name && typeof name === "string") user.name = name.trim();
  if (
    totalBalanceCurrency &&
    (CURRENCIES as readonly string[]).includes(totalBalanceCurrency)
  )
    user.totalBalanceCurrency = totalBalanceCurrency;

  await user.save();

  ok(
    res,
    {
      id: user._id,
      email: user.email,
      name: user.name,
      totalBalanceCurrency: user.totalBalanceCurrency,
    },
    "Profile updated",
  );
});

export const requestEmailChange: RequestHandler = asyncHandler(
  async (req, res) => {
    const { email } = req.body;
    if (!email || typeof email !== "string")
      throw new AppError("New email is required", 400);

    const user = await UserModel.findById(req.user!.id);
    if (!user) throw new AppError("User not found", 404);

    if (email.toLowerCase() === user.email)
      throw new AppError("New email must be different from current email", 400);

    const existing = await UserModel.findOne({ email: email.toLowerCase() });
    if (existing) throw new AppError("Email already in use", 409);

    const token = randomBytes(32).toString("hex");
    user.pendingEmail = email.toLowerCase();
    user.emailChangeToken = token;
    user.emailChangeExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    await sendChangeEmailVerification(email, user.name, token);

    ok(res, undefined, "Verification email sent to your new address");
  },
);

export const confirmEmailChange: RequestHandler = asyncHandler(
  async (req, res) => {
    const { token } = req.query;
    if (!token || typeof token !== "string")
      throw new AppError("Invalid or missing token", 400);

    const user = await UserModel.findOne({
      emailChangeToken: token,
      emailChangeExpires: { $gt: new Date() },
    });

    if (!user?.pendingEmail)
      throw new AppError("Invalid or expired token", 400);

    user.email = user.pendingEmail;
    user.pendingEmail = undefined;
    user.emailChangeToken = undefined;
    user.emailChangeExpires = undefined;
    await user.save();

    ok(res, undefined, "Email updated successfully");
  },
);

export const refresh: RequestHandler = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken || typeof refreshToken !== "string")
    throw new AppError("Refresh token required", 400);

  let payload: { userId: string };
  try {
    payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as {
      userId: string;
    };
  } catch {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const user = await UserModel.findById(payload.userId);
  if (!user) throw new AppError("User not found", 404);

  const stored = user.refreshTokens.find(
    (t) => t.token === refreshToken && t.expiresAt > new Date(),
  );
  if (!stored) throw new AppError("Invalid or expired refresh token", 401);

  const accessToken = jwt.sign(
    { userId: user._id, email: user.email },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"] },
  );

  ok(
    res,
    {
      accessToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        totalBalanceCurrency: user.totalBalanceCurrency,
      },
    },
    "Access token refreshed",
  );
});

export const logout: RequestHandler = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken || typeof refreshToken !== "string") {
    ok(res, undefined, "Logged out successfully");
    return;
  }

  let payload: { userId: string };
  try {
    payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET) as {
      userId: string;
    };
  } catch {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const user = await UserModel.findById(payload.userId);
  if (!user) throw new AppError("User not found", 404);

  user.refreshTokens = user.refreshTokens.filter(
    (t) => t.token !== refreshToken,
  );
  await user.save();

  res.clearCookie("refreshToken");
  ok(res, undefined, "Logged out successfully");
});

export const getSessions: RequestHandler = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.user!.id);
  if (!user) throw new AppError("User not found", 404);

  const now = new Date();
  const sessions = user.refreshTokens
    .filter((t) => t.expiresAt > now)
    .map((t) => ({
      id: t._id,
      deviceID: t.deviceID,
      userAgent: t.userAgent,
      expiresAt: t.expiresAt,
    }));

  ok(res, sessions, "Sessions retrieved");
});

export const deleteSession: RequestHandler = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.user!.id);
  if (!user) throw new AppError("User not found", 404);

  const { id } = req.params;
  user.refreshTokens = user.refreshTokens.filter(
    (t) => t._id?.toString() !== id,
  );
  await user.save();

  ok(res, undefined, "Session deleted");
});
