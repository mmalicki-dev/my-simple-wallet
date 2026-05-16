import type { User } from "shared";

export type { User as UserResponse };

export interface Session {
  id: string;
  deviceID: string;
  userAgent: string;
  expiresAt: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface ResetPassRequest {
  token: string;
  password: string;
}

export interface ForgotPassRequest {
  email: string;
}
