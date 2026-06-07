import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import type { RootState } from "./store";
import { logout, setCredentials } from "./slices/authSlice";
import { SecureTokenService } from "@/services/secureStorage";
import { getDeviceInfo } from "@/utils/device";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:5000"}/api`,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    headers.set("X-Device-Info", getDeviceInfo());
    return headers;
  },
});

const unwrap = (result: Awaited<ReturnType<typeof rawBaseQuery>>) => {
  if (result.data && typeof result.data === "object" && "data" in result.data) {
    result.data = result.data.data;
  }
  return result;
};

let refreshPromise: Promise<boolean> | null = null;

const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, queryApi, extra) => {
  let result = unwrap(await rawBaseQuery(args, queryApi, extra));

  if (result.error?.status === 401) {
    refreshPromise ??= (async () => {
      try {
        const { refreshToken, deviceID } = await SecureTokenService.getTokens();
        if (!refreshToken || !deviceID) return false;

        const refreshResult = await rawBaseQuery(
          {
            url: "/mobile/auth/refresh",
            method: "POST",
            body: { refreshToken, deviceID },
          },
          queryApi,
          extra,
        );

        if (refreshResult.data) {
          const d = (
            refreshResult.data as {
              data: {
                accessToken: string;
                refreshToken: string;
                deviceID: string;
                user: RootState["auth"]["user"];
              };
            }
          ).data;
          await SecureTokenService.saveTokens(d.refreshToken, d.deviceID);
          queryApi.dispatch(
            setCredentials({ user: d.user!, accessToken: d.accessToken }),
          );
          return true;
        }

        await SecureTokenService.clearTokens();
        queryApi.dispatch(logout());
        return false;
      } finally {
        refreshPromise = null;
      }
    })();

    const refreshed = await refreshPromise;
    if (refreshed) {
      result = unwrap(await rawBaseQuery(args, queryApi, extra));
    } else {
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
