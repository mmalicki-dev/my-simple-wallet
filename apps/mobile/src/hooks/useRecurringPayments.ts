import { useGetRecurringPaymentsQuery } from "@/services";

export const useRecurringPayments = () => {
  const { data, isLoading, isError } = useGetRecurringPaymentsQuery();
  const loans = data?.filter((p) => p.type === "loan") ?? [];
  const subscriptions = data?.filter((p) => p.type === "subscription") ?? [];
  return { loans, subscriptions, isLoading, isError };
};
