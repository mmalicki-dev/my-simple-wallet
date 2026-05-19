import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import type { Transaction } from "@/types";
import TransactionList from "@/components/organisms/TransactionList/TransactionList";
import BackButton from "@/components/molecules/BackButton/BackButton";
import Modal from "@/components/templates/Modal/Modal";
import TransactionForm from "@/components/organisms/TransactionForm/TransactionForm";
import HudPanel from "@/components/templates/HudPanel/HudPanel";
import PanelLabel from "@/components/atoms/PanelLabel/PanelLabel";
import Chart from "@/components/organisms/Chart/Chart";
import { useGetAccountsQuery } from "@/services/accountApi";
import {
  useGetTransactionsQuery,
  useDeleteTransactionMutation,
} from "@/services/transactionApi";
import { useGetRecurringPaymentsQuery } from "@/services/recurringPaymentApi";
import { useGetCategoriesQuery } from "@/services/categoryApi";
import styles from "./AccountPage.module.css";
import SkeletonLoader from "@/components/atoms/SkeletonLoader/SkeletonLoader";

const AccountPage = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [monthsBack, setMonthsBack] = useState(0);

  const today = new Date();
  const from = new Date(today.getFullYear(), today.getMonth() - monthsBack, 1)
    .toISOString()
    .slice(0, 10);
  const to = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0,
    23,
    59,
    59,
    999,
  )
    .toISOString()
    .slice(0, 10);

  const { data: accounts = [], isLoading: accountsLoading } =
    useGetAccountsQuery();
  const {
    data: txData,
    isLoading: txLoading,
    isFetching: txFetching,
  } = useGetTransactionsQuery({ accountId: id, from, to });
  const transactions = txData?.transactions ?? [];
  const hasMore = txData?.hasMore ?? true;
  const isLoadingMore = txFetching && !txLoading;

  const { data: categories = [] } = useGetCategoriesQuery();

  const { data: recurringPayments = [] } = useGetRecurringPaymentsQuery();
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59);
  const recurringScheduled: Transaction[] = recurringPayments
    .filter((rp) => {
      const due = new Date(rp.nextDueDate);
      return rp.isActive && rp.account === id && due >= today && due <= monthEnd;
    })
    .map((rp) => ({
      _id: rp._id,
      account: rp.account,
      category: rp.category,
      amount: rp.amount,
      type: "expense" as const,
      status: "scheduled" as const,
      description: rp.name,
      date: rp.nextDueDate,
      createdAt: rp.createdAt,
      updatedAt: rp.updatedAt,
    }));
  const recurringIds = new Set(recurringScheduled.map((r) => r._id));

  const scheduledTransactions = [
    ...transactions.filter((t) => t.status === "scheduled"),
    ...recurringScheduled,
  ];

  const postedTransactions = transactions.filter((t) => t.status === "posted");

  const prevCountRef = useRef<number | null>(null);
  useEffect(() => {
    if (txLoading || prevCountRef.current === null) return;
    if (transactions.length === prevCountRef.current && hasMore) {
      prevCountRef.current = transactions.length;
      setMonthsBack((m) => m + 1);
    } else {
      prevCountRef.current = null;
    }
  }, [txLoading, txData]);

  const handleLoadMore = () => {
    prevCountRef.current = transactions.length;
    setMonthsBack((m) => m + 1);
  };

  const [deleteTransaction] = useDeleteTransactionMutation({
    fixedCacheKey: "delete-transaction",
  });

  const account = accounts.find((a) => a._id === id) ?? accounts[0];
  const isLoading = accountsLoading || txLoading;

  if (!account) return <span>Something went wrong</span>;

  return (
    <>
      <Helmet>
        <title>{account.name}</title>
      </Helmet>
      <Modal
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        title="New Transaction"
      >
        <TransactionForm
          accountId={account._id}
          onClose={() => setIsCreating(false)}
        />
      </Modal>
      <Modal
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        title="Edit Transaction"
      >
        {selectedTransaction && (
          <TransactionForm
            transaction={selectedTransaction}
            onClose={() => setSelectedTransaction(null)}
            onDelete={() => {
              deleteTransaction({ id: selectedTransaction._id });
              setSelectedTransaction(null);
            }}
          />
        )}
      </Modal>

      <div className={styles.page}>
        <div className={styles.back}>
          <BackButton />
        </div>

        <div className={styles.header}>
          {isLoading && (
            <>
              <SkeletonLoader /> <SkeletonLoader />
            </>
          )}
          {!isLoading && (
            <>
              <h1 className={styles.name}>{account.name}</h1>
              <div className={styles.headerRight}>
                <span
                  className={[
                    styles.balance,
                    account.balance > 0 ? styles.over : styles.under,
                  ].join(" ")}
                >
                  {account.balance.toLocaleString()} {account.currency}
                </span>
                <button
                  className={styles.addBtn}
                  onClick={() => setIsCreating(true)}
                >
                  +
                </button>
              </div>
            </>
          )}
        </div>

        <div className={styles.left}>
          <HudPanel className={styles.postedPanel}>
            <PanelLabel label="Posted" />
            {isLoading && <SkeletonLoader />}
            {!isLoading && (
              <div className={styles.scrollArea}>
                <TransactionList
                  transactions={postedTransactions}
                  currency={account.currency}
                  onTransactionClick={setSelectedTransaction}
                  onLoadMore={hasMore ? handleLoadMore : undefined}
                  isLoadingMore={isLoadingMore}
                />
              </div>
            )}
          </HudPanel>
        </div>

        <div className={styles.right}>
          {!isLoading && scheduledTransactions.length > 0 && (
            <HudPanel className={styles.scheduledPanel}>
              <PanelLabel label="Scheduled" />
              <div className={styles.scrollArea}>
                <TransactionList
                  transactions={scheduledTransactions}
                  currency={account.currency}
                  onTransactionClick={(t) => {
                    if (!recurringIds.has(t._id)) setSelectedTransaction(t);
                  }}
                />
              </div>
            </HudPanel>
          )}
          <HudPanel className={styles.chartPanel}>
            <PanelLabel label="Balance" />
            {!isLoading && (
              <Chart
                transactions={postedTransactions}
                categories={categories}
                dataType="balance"
                chartType="line"
              />
            )}
            {isLoading && <SkeletonLoader />}
          </HudPanel>
        </div>
      </div>
    </>
  );
};

export default AccountPage;
