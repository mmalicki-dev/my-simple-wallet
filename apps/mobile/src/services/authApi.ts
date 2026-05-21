import { api } from "@/redux/api";
import { logout, setCredentials } from "@/redux/slices/authSlice";
import type {
  UserResponse,
  RegisterRequest,
  ResetPassRequest,
  ForgotPassRequest,
  LoginRequest,
  Session,
  MobileLoginResponse,
} from "shared";
import { SecureTokenService } from "./secureStorage";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<MobileLoginResponse, LoginRequest>({
      query: (body) => ({ url: "/mobile/auth/login", method: "POST", body }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setCredentials({ user: data.user, accessToken: data.accessToken }),
          );
          if (data.refreshToken && data.deviceID) {
            await SecureTokenService.saveTokens(data.refreshToken, data.deviceID);
          }
        } catch {}
      },
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
      queryFn: async (_, { dispatch }, __, baseQuery) => {
        const { refreshToken, deviceID } = await SecureTokenService.getTokens();
        const result = await baseQuery({
          url: "/mobile/auth/logout",
          method: "POST",
          body: { refreshToken, deviceID },
        });
        await SecureTokenService.clearTokens();
        dispatch(logout());
        dispatch(api.util.resetApiState());
        return result.error ? { error: result.error } : { data: undefined };
      },
    }),
    updateProfile: builder.mutation<
      UserResponse,
      { name?: string; totalBalanceCurrency?: string }
    >({
      query: (body) => ({ url: "/auth/profile", method: "PUT", body }),
    }),
    requestEmailChange: builder.mutation<void, { email: string }>({
      query: (body) => ({ url: "/auth/change-email", method: "POST", body }),
    }),
    verifyEmail: builder.mutation<void, { token: string }>({
      query: ({ token }) => ({
        url: `/auth/verify-email?token=${token}`,
        method: "GET",
      }),
    }),
    confirmEmailChange: builder.mutation<void, { token: string }>({
      query: ({ token }) => ({
        url: `/auth/confirm-email-change?token=${token}`,
        method: "GET",
      }),
    }),
    getSessions: builder.query<Session[], void>({
      query: () => "/auth/sessions",
      providesTags: ["Session"],
    }),
    deleteSession: builder.mutation<void, string>({
      query: (id) => ({ url: `/auth/sessions/${id}`, method: "DELETE" }),
      invalidatesTags: ["Session"],
    }),
    changePassword: builder.mutation<
      void,
      { oldPassword: string; newPassword: string }
    >({
      query: (body) => ({ url: "/auth/change-password", method: "POST", body }),
    }),
    deleteUser: builder.mutation<void, { password: string }>({
      query: (body) => ({ url: "/auth/delete-user", method: "DELETE", body }),
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
  useDeleteUserMutation,
} = authApi;
