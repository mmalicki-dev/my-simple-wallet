import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";
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
    result.data = (result.data as { data: unknown }).data;
  }
  return result;
};

const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extra,
) => {
  let result = unwrap(await rawBaseQuery(args, api, extra));

  if (result.error?.status === 401) {
    const refreshResult = await rawBaseQuery(
      { url: "/auth/refresh", method: "POST" },
      api,
      extra,
    );

    if (refreshResult.data) {
      const { accessToken } = (refreshResult.data as { data: { accessToken: string } }).data;
      const user = (api.getState() as RootState).auth.user!;
      api.dispatch(setCredentials({ user, accessToken }));
      result = unwrap(await rawBaseQuery(args, api, extra));
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Transaction", "Account", "Category", "RecurringPayment"],
  endpoints: () => ({}),
});
