import { api } from "@/redux/api";
import type {
  UserResponse,
  LoginResponse,
  RegisterRequest,
  ResetPassRequest,
  ForgotPassRequest,
  LoginRequest,
  Session,
} from "@/types";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
    }),
    getMe: builder.query<UserResponse, void>({
      query: () => "/auth/me",
    }),
    register: builder.mutation<void, RegisterRequest>({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
    }),
    forgotPassword: builder.mutation<void, ForgotPassRequest>({
      query: (body) => ({ url: "/auth/forgot-password", method: "POST", body }),
    }),
    resetPassword: builder.mutation<void, ResetPassRequest>({
      query: ({ token, password }) => ({
        url: `/auth/reset-password?token=${token}`,
        method: "POST",
        body: { password },
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
    }),
    updateProfile: builder.mutation<UserResponse, { name?: string; totalBalanceCurrency?: string }>({
      query: (body) => ({ url: "/auth/profile", method: "PUT", body }),
    }),
    requestEmailChange: builder.mutation<void, { email: string }>({
      query: (body) => ({ url: "/auth/change-email", method: "POST", body }),
    }),
    verifyEmail: builder.mutation<void, { token: string }>({
      query: ({ token }) => ({ url: `/auth/verify-email?token=${token}`, method: "GET" }),
    }),
    confirmEmailChange: builder.mutation<void, { token: string }>({
      query: ({ token }) => ({ url: `/auth/confirm-email-change?token=${token}`, method: "GET" }),
    }),
    getSessions: builder.query<Session[], void>({
      query: () => "/auth/sessions",
      providesTags: ["Session"],
    }),
    deleteSession: builder.mutation<void, string>({
      query: (id) => ({ url: `/auth/sessions/${id}`, method: "DELETE" }),
      invalidatesTags: ["Session"],
    }),
    changePassword: builder.mutation<void, { oldPassword: string; newPassword: string }>({
      query: (body) => ({ url: "/auth/change-password", method: "POST", body }),
    }),
  }),
});

export const {
  useLoginMutation,
  useGetMeQuery,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutMutation,
  useUpdateProfileMutation,
  useRequestEmailChangeMutation,
  useVerifyEmailMutation,
  useConfirmEmailChangeMutation,
  useGetSessionsQuery,
  useDeleteSessionMutation,
  useChangePasswordMutation,
} = authApi;
