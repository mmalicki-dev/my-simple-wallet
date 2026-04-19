export interface LoginResponse {
  accessToken: string;
  user: UserResponse;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
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
