import { api } from "@/redux/api";
import type {
  Account,
  CreateAccountRequest,
  UpdateAccountRequest,
  DeleteAccountRequest,
} from "@/types";

export const accountApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAccounts: builder.query<Account[], void>({
      query: () => ({ url: "/account", method: "GET" }),
      providesTags: ["Account"],
    }),
    createAccount: builder.mutation<Account, CreateAccountRequest>({
      query: (body) => ({ url: "/account", method: "POST", body }),
      invalidatesTags: ["Account"],
    }),
    updateAccount: builder.mutation<Account, UpdateAccountRequest>({
      query: ({ id, body }) => ({ url: `/account/${id}`, method: "PUT", body }),
      invalidatesTags: ["Account"],
    }),
    deleteAccount: builder.mutation<void, DeleteAccountRequest>({
      query: ({ id }) => ({ url: `/account/${id}`, method: "DELETE" }),
      invalidatesTags: ["Account"],
    }),
  }),
});

export const {
  useGetAccountsQuery,
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
} = accountApi;
