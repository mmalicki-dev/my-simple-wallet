import { useEffect, useState } from "react";
import type { Transaction } from "@/types";
import type { Currency } from "shared";
import TransactionItem from "@/components/molecules/TransactionItem/TransactionItem";
import SkeletonLoader from "@/components/atoms/SkeletonLoader/SkeletonLoader";
import {
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} from "@/services/transactionApi";
import styles from "./TransactionList.module.css";
import Icon from "@/components/atoms/Icon/Icon";

interface TransactionListProps {
  transactions: Transaction[];
  currency: Currency;
  isLoading?: boolean;
  isLoadingMore?: boolean;
  onTransactionClick?: (transaction: Transaction) => void;
  onLoadMore?: () => void;
}

const getMonthLabel = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en", {
    month: "long",
    year: "numeric",
  });

const groupByMonth = (
  transactions: Transaction[],
): [string, Transaction[]][] => {
  const sorted = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const map = new Map<string, Transaction[]>();
  for (const t of sorted) {
    const key = getMonthLabel(t.date);
    if (!map.has(key)) map.set(key, []);
    map.get(key)?.push(t);
  }

  return [...map.entries()];
};

const TransactionList = ({
  transactions,
  currency,
  isLoading,
  isLoadingMore,
  onTransactionClick,
  onLoadMore,
}: TransactionListProps) => {
  const [
    ,
    {
      isLoading: isCreating,
      isError: isCreateError,
      isSuccess: isCreateSuccess,
    },
  ] = useCreateTransactionMutation({ fixedCacheKey: "create-transaction" });
  const [
    ,
    {
      isLoading: isUpdating,
      isError: isUpdateError,
      isSuccess: isUpdateSuccess,
    },
  ] = useUpdateTransactionMutation({ fixedCacheKey: "update-transaction" });
  const [
    ,
    {
      isLoading: isDeleting,
      isError: isDeleteError,
      isSuccess: isDeleteSuccess,
    },
  ] = useDeleteTransactionMutation({ fixedCacheKey: "delete-transaction" });

  const isMutating = isCreating || isUpdating || isDeleting;
  const hasError = isCreateError || isUpdateError || isDeleteError;
  const isSuccess = isCreateSuccess || isUpdateSuccess || isDeleteSuccess;

  const [showSuccess, setShowSuccess] = useState(false);
  useEffect(() => {
    if (!isSuccess) return;
    setShowSuccess(true);
    const t = setTimeout(() => setShowSuccess(false), 1500);
    return () => clearTimeout(t);
  }, [isSuccess]);

  if (isLoading) return <SkeletonLoader count={5} />;
  if (transactions.length === 0)
    return (
      <>
        <p className={styles.empty}>
          No transactions yet in{" "}
          {new Date()
            .toLocaleString("default", { month: "long" })
            .toLocaleUpperCase()}
          .
        </p>
        {isLoadingMore ? (
          <SkeletonLoader />
        ) : (
          <button className={styles.add} onClick={onLoadMore}>
            <Icon name="arrow-down" />
          </button>
        )}
      </>
    );

  const groups = groupByMonth(transactions);

  return (
    <div className={styles.wrapper}>
      {isMutating && <SkeletonLoader />}
      {hasError && (
        <p className={styles.mutationError}>
          Something went wrong. Please try again.
        </p>
      )}
      {showSuccess && <p className={styles.mutationSuccess}>Saved!</p>}
      {groups.map(([month, items]) => (
        <section key={month}>
          <h3 className={styles.monthLabel}>{month}</h3>
          <ul className={styles.list}>
            {items.map((t) => (
              <TransactionItem
                key={t._id}
                transaction={t}
                currency={currency}
                onClick={
                  onTransactionClick ? () => onTransactionClick(t) : undefined
                }
              />
            ))}
          </ul>
        </section>
      ))}
      {onLoadMore && (
        isLoadingMore ? (
          <SkeletonLoader />
        ) : (
          <button className={styles.add} onClick={onLoadMore}>
            <Icon name="arrow-down" />
          </button>
        )
      )}
    </div>
  );
};

export default TransactionList;
