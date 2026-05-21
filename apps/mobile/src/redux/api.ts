import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import type { RootState } from "./store";
import { logout, setCredentials } from "./slices/authSlice";
import { SecureTokenService } from "@/services/secureStorage";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000"}/api`,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

const unwrap = (result: Awaited<ReturnType<typeof rawBaseQuery>>) => {
  if (result.data && typeof result.data === "object" && "data" in result.data) {
    result.data = result.data.data;
  }
  return result;
};

const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, queryApi, extra) => {
  let result = unwrap(await rawBaseQuery(args, queryApi, extra));

  if (result.error?.status === 401) {
    const { refreshToken, deviceID } = await SecureTokenService.getTokens();

    if (refreshToken && deviceID) {
      const refreshResult = await rawBaseQuery(
        {
          url: "/mobile/auth/refresh",
          body: { refreshToken, deviceID },
          method: "POST",
        },
        queryApi,
        extra,
      );

      if (refreshResult.data) {
        await SecureTokenService.saveTokens(
          (refreshResult.data as { data: { refreshToken: string } }).data
            .refreshToken,
          (refreshResult.data as { data: { deviceID: string } }).data.deviceID,
        );
        const accessToken = (
          refreshResult.data as { data: { accessToken: string } }
        ).data.accessToken;
        const user = (queryApi.getState() as RootState).auth.user!;
        queryApi.dispatch(setCredentials({ user, accessToken }));
        result = unwrap(await rawBaseQuery(args, queryApi, extra));
      } else {
        await SecureTokenService.clearTokens();
        queryApi.dispatch(logout());
        queryApi.dispatch(api.util.resetApiState());
      }
    } else {
      queryApi.dispatch(logout());
      queryApi.dispatch(api.util.resetApiState());
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: [
    "Transaction",
    "Account",
    "Category",
    "RecurringPayment",
    "Session",
  ],
  endpoints: () => ({}),
});
