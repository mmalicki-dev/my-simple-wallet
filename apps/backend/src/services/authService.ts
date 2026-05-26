import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import { IUser } from "../models/User";
import env from "../config/env.js";
import { AppError } from "../lib/index.js";

interface ICreateTokens {
  user: IUser;
  withRefresh?: boolean;
  existingDeviceID?: string;
}

interface TokensWithRefresh {
  accessToken: string;
  refreshToken: string;
  deviceID: string;
}

interface TokensWithoutRefresh {
  accessToken: string;
}

interface ISaveRefreshToken {
  user: IUser;
  refreshToken: string;
  deviceID: string;
  userAgent: string;
}

interface IRotateRefreshToken {
  user: IUser;
  currentRefreshToken: string;
  currentDeviceID: string;
}

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

export function createTokens(
  params: ICreateTokens & { withRefresh: true },
): TokensWithRefresh;
export function createTokens(
  params: ICreateTokens & { withRefresh?: false },
): TokensWithoutRefresh;
export function createTokens({
  user,
  withRefresh,
  existingDeviceID,
}: ICreateTokens): TokensWithRefresh | TokensWithoutRefresh {
  const accessToken = jwt.sign(
    { userId: user._id, email: user.email },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"] },
  );

  if (withRefresh) {
    const refreshToken = jwt.sign(
      { userId: user._id, email: user.email },
      env.JWT_REFRESH_SECRET,
      { expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"] },
    );
    const deviceID = existingDeviceID ?? randomUUID();
    return { accessToken, refreshToken, deviceID };
  }

  return { accessToken };
}

export const saveRefreshToken = async ({
  user,
  refreshToken,
  deviceID,
  userAgent,
}: ISaveRefreshToken) => {
  const expiresAt = new Date(
    Date.now() + parseDuration(env.JWT_REFRESH_EXPIRES_IN),
  );
  user.refreshTokens = [
    ...user.refreshTokens.filter(
      (t) => t.expiresAt > new Date() && t.deviceID !== deviceID,
    ),
    { token: refreshToken, expiresAt, deviceID, userAgent },
  ];
  await user.save();
};

export const rotateRefreshToken = async ({
  user,
  currentRefreshToken,
  currentDeviceID,
}: IRotateRefreshToken): Promise<TokensWithRefresh> => {
  const stored = user.refreshTokens.find(
    (t) =>
      t.token === currentRefreshToken &&
      t.expiresAt > new Date() &&
      t.deviceID === currentDeviceID,
  );
  if (!stored) throw new AppError("Invalid or expired refresh token", 401);

  const { accessToken, refreshToken, deviceID } = createTokens({
    user,
    withRefresh: true,
    existingDeviceID: currentDeviceID,
  });

  const expiresAt = new Date(
    Date.now() + parseDuration(env.JWT_REFRESH_EXPIRES_IN),
  );

  stored.token = refreshToken;
  stored.expiresAt = expiresAt;
  await user.save();

  return {
    accessToken,
    refreshToken,
    deviceID,
  };
};
