import { RequestHandler } from "express";
import { asyncHandler, AppError, ok } from "../../lib";
import env from "../../config/env";
import jwt from "jsonwebtoken";
import { UserModel } from "../../models";
import {
  createTokens,
  rotateRefreshToken,
  saveRefreshToken,
} from "../../services/authService";
import { validate } from "../validators/authValidator";
import { loginSchema } from "shared";

export const refresh: RequestHandler = asyncHandler(async (req, res) => {
  const { refreshToken: currentRefreshToken, deviceID: currentDeviceID } =
    req.body;

  if (!currentRefreshToken || typeof currentRefreshToken !== "string")
    throw new AppError("Refresh token required", 400);

  let payload: { userId: string };
  try {
    payload = jwt.verify(currentRefreshToken, env.JWT_REFRESH_SECRET) as {
      userId: string;
    };
  } catch {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const user = await UserModel.findById(payload.userId);
  if (!user) throw new AppError("User not found", 404);

  const { accessToken, refreshToken, deviceID } = await rotateRefreshToken({
    user,
    currentRefreshToken,
    currentDeviceID,
  });

  ok(
    res,
    {
      accessToken,
      refreshToken,
      deviceID,
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

  const userAgent = req.headers["user-agent"] ?? "unknown";

  if (result.data.rememberMe) {
    const { accessToken, refreshToken, deviceID } = createTokens({
      user,
      withRefresh: true,
      existingDeviceID: req.body.deviceID,
    });
    await saveRefreshToken({ user, refreshToken, deviceID, userAgent });
    return ok(
      res,
      {
        accessToken,
        refreshToken,
        deviceID,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          totalBalanceCurrency: user.totalBalanceCurrency,
        },
      },
      "Logged in successfully",
    );
  }

  const { accessToken } = createTokens({ user });
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

export const logout: RequestHandler = asyncHandler(async (req, res) => {
  const { refreshToken, deviceID } = req.body;

  if (!refreshToken || typeof refreshToken !== "string") {
    ok(res, undefined, "Logged out successfully");
    return;
  }

  if (!deviceID || typeof deviceID !== "string") {
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

  ok(res, undefined, "Logged out successfully");
});
