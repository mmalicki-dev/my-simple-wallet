import { api } from "@/redux/api";
import type {
  RecurringPayment,
  CreateRecurringPaymentRequest,
  UpdateRecurringPaymentRequest,
  DeleteRecurringPaymentRequest,
} from "@/types";
import { ApiResponse } from "shared";

export const recurringPaymentApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRecurringPayments: builder.query<ApiResponse<RecurringPayment[]>, void>({
      query: () => "/recurringPayment",
      providesTags: ["RecurringPayment"],
    }),
    createRecurringPayment: builder.mutation<
      ApiResponse<RecurringPayment>,
      CreateRecurringPaymentRequest
    >({
      query: (body) => ({
        url: "/recurringPayment",
        method: "POST",
        body,
      }),
      invalidatesTags: ["RecurringPayment"],
    }),
    updateRecurringPayment: builder.mutation<
      ApiResponse<RecurringPayment>,
      UpdateRecurringPaymentRequest
    >({
      query: ({ id, body }) => ({
        url: `/recurringPayment/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["RecurringPayment"],
    }),
    deleteRecurringPayment: builder.mutation<
      void,
      DeleteRecurringPaymentRequest
    >({
      query: ({ id }) => ({
        url: `/recurringPayment/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["RecurringPayment"],
    }),
  }),
});

export const {
  useGetRecurringPaymentsQuery,
  useCreateRecurringPaymentMutation,
  useUpdateRecurringPaymentMutation,
  useDeleteRecurringPaymentMutation,
} = recurringPaymentApi;
