import type { Transaction } from "@/types";
import type { Currency } from "shared";
import TransactionItem from "@/components/molecules/TransactionItem/TransactionItem";
import SkeletonLoader from "@/components/atoms/SkeletonLoader/SkeletonLoader";
import styles from "./TransactionList.module.css";
import Icon from "@/components/atoms/Icon/Icon";

interface TransactionListProps {
  transactions: Transaction[];
  currency: Currency;
  isLoading?: boolean;
  onTransactionClick?: (transaction: Transaction) => void;
  onAddClick?: () => void;
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
  onTransactionClick,
  onAddClick,
  onLoadMore,
}: TransactionListProps) => {
  if (isLoading) return <SkeletonLoader count={5} />;
  if (transactions.length === 0)
    return (
      <>
        <button className={styles.add} onClick={onAddClick}>
          <Icon name="add-circle" />
        </button>
        <p className={styles.empty}>
          No transactions yet in{" "}
          {new Date()
            .toLocaleString("default", { month: "long" })
            .toLocaleUpperCase()}
          .
        </p>
        <button className={styles.add} onClick={onLoadMore}>
          <Icon name="arrow-down" />
        </button>
      </>
    );

  const groups = groupByMonth(transactions);

  return (
    <div className={styles.wrapper}>
      {onAddClick && (
        <button className={styles.add} onClick={onAddClick}>
          <Icon name="add-circle" />
        </button>
      )}
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
        <button className={styles.add} onClick={onLoadMore}>
          <Icon name="arrow-down" />
        </button>
      )}
    </div>
  );
};

export default TransactionList;
