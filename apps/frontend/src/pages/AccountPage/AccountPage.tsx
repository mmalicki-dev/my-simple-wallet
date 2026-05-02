import { useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import type { Transaction } from "@/types";
import TransactionList from "@/components/organisms/TransactionList/TransactionList";
import BackButton from "@/components/molecules/BackButton/BackButton";
import Modal from "@/components/templates/Modal/Modal";
import EditTransactionForm from "@/components/organisms/EditTransactionForm/EditTransactionForm";
import HudPanel from "@/components/templates/HudPanel/HudPanel";
import { useGetAccountsQuery } from "@/services/accountApi";
import {
  useGetTransactionsQuery,
  useDeleteTransactionMutation,
} from "@/services/transactionApi";
import styles from "./AccountPage.module.css";
import SkeletonLoader from "@/components/atoms/SkeletonLoader/SkeletonLoader";

const AccountPage = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loadMoreCount, setLoadMoreCount] = useState(0);

  const { data: accounts = [], isLoading: accountsLoading } =
    useGetAccountsQuery();
  const { data: transactions = [], isLoading: txLoading } =
    useGetTransactionsQuery({ accountId: id });
  const [deleteTransaction] = useDeleteTransactionMutation({
    fixedCacheKey: "delete-transaction",
  });

  const account = accounts.find((a) => a._id === id) ?? accounts[0];
  const isLoading = accountsLoading || txLoading;

  function useHandleLoadMore() {
    const today = new Date();
    const from = new Date(
      today.getFullYear(),
      today.getMonth() - (loadMoreCount + 1),
      1,
    );
    const to = today.toISOString().slice(0, 10);
    useGetTransactionsQuery({
      accountId: id,
      from: from.toISOString().slice(0, 10),
      to,
    });
    setLoadMoreCount((c) => c + 1);
  }

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
        <EditTransactionForm
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
          <EditTransactionForm
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
        <BackButton />
        <div className={styles.header}>
          {isLoading && (
            <>
              <SkeletonLoader /> <SkeletonLoader />
            </>
          )}
          {!isLoading && (
            <>
              <h1 className={styles.name}>{account.name}</h1>
              <span
                className={[
                  styles.balance,
                  account.balance > 0 ? styles.over : styles.under,
                ].join(" ")}
              >
                {account.balance.toLocaleString()} {account.currency}
              </span>
            </>
          )}
        </div>
        <HudPanel>
          {isLoading && <SkeletonLoader />}
          {!isLoading && (
            <TransactionList
              transactions={transactions}
              currency={account.currency}
              onTransactionClick={setSelectedTransaction}
              onAddClick={() => setIsCreating(true)}
              onLoadMore={() => useHandleLoadMore}
            />
          )}
        </HudPanel>
      </div>
    </>
  );
};

export default AccountPage;
