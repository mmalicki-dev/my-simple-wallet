import { api } from "@/redux/api";
import type {
  Transaction,
  GetTransactionsRequest,
  CreateTransactionRequest,
  UpdateTransactionRequest,
  DeleteTransactionRequest,
} from "@/types";

export const transactionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getTransactions: builder.query<{ transactions: Transaction[]; hasMore: boolean }, GetTransactionsRequest>({
      query: ({ accountId, from, to } = {}) => {
        const params = new URLSearchParams();
        if (accountId) params.set("accountId", accountId);
        if (from) params.set("from", from);
        if (to) params.set("to", to);
        const qs = params.toString();
        return qs ? `/transaction?${qs}` : "/transaction";
      },
      providesTags: ["Transaction"],
    }),
    createTransaction: builder.mutation<Transaction, CreateTransactionRequest>({
      query: (body) => ({ url: "/transaction", method: "POST", body }),
      invalidatesTags: ["Transaction", "Account"],
    }),
    updateTransaction: builder.mutation<Transaction, UpdateTransactionRequest>({
      query: ({ id, body }) => ({
        url: `/transaction/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Transaction", "Account"],
    }),
    deleteTransaction: builder.mutation<void, DeleteTransactionRequest>({
      query: ({ id }) => ({ url: `/transaction/${id}`, method: "DELETE" }),
      invalidatesTags: ["Transaction", "Account"],
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} = transactionApi;
