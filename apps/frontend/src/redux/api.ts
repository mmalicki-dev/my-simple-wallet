import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "./store";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL ?? "http://localhost:3000"}/api`,

    prepareHeaders: (headers, { getState }) => {
      // read token from store using getState — no import needed
      const token = (getState() as RootState).auth.accessToken;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Transaction", "Account", "Category", "RecurringPayment"],
  endpoints: () => ({}),
});
