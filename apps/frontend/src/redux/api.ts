import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import type { RootState } from "./store";
import { setCredentials, logout } from "./slices/authSlice";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_URL ?? "http://localhost:3000"}/api`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
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
    const refreshResult = await rawBaseQuery(
      { url: "/auth/refresh", method: "POST" },
      queryApi,
      extra,
    );

    if (refreshResult.data) {
      const { accessToken } = (
        refreshResult.data as { data: { accessToken: string } }
      ).data;
      const user = (queryApi.getState() as RootState).auth.user!;
      queryApi.dispatch(setCredentials({ user, accessToken }));
      result = unwrap(await rawBaseQuery(args, queryApi, extra));
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
