import { useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import type { Account, Transaction } from "@/types";
import TransactionList from "@/components/organisms/TransactionList/TransactionList";
import BackButton from "@/components/molecules/BackButton/BackButton";
import Modal from "@/components/templates/Modal/Modal";
import EditTransactionForm from "@/components/organisms/EditTransactionForm/EditTransactionForm";
import styles from "./AccountPage.module.css";
import {
  useGetTransactionsQuery,
  useDeleteTransactionMutation,
  useGetAccountsQuery,
} from "@/services";

const AccountPage = () => {
  const { id } = useParams<{ id: any }>();
  const { data: accounts } = useGetAccountsQuery<{ data: Account[] }>();
  const { data: transactions } = useGetTransactionsQuery<{
    data: Transaction[];
  }>(id);
  const account = accounts.find((a) => a._id === id) ?? accounts[0];
  const [deleteTransaction] = useDeleteTransactionMutation();

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  return (
    <>
      <Helmet>
        <title>{account.name}</title>
      </Helmet>
      <Modal
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        title="Edit transaction"
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
          <h1 className={styles.name}>{account.name}</h1>
          <span className={styles.balance}>
            {account.balance.toLocaleString()} {account.currency}
          </span>
        </div>
        <TransactionList
          transactions={transactions}
          currency={account.currency}
          onTransactionClick={setSelectedTransaction}
        />
      </div>
    </>
  );
};

export default AccountPage;
