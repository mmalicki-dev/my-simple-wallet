import { useState } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import type { Transaction } from "@/types";
import TransactionList from "@/components/organisms/TransactionList/TransactionList";
import BackButton from "@/components/molecules/BackButton/BackButton";
import Modal from "@/components/templates/Modal/Modal";
import EditTransactionForm from "@/components/organisms/EditTransactionForm/EditTransactionForm";
import Spinner from "@/components/atoms/Spinner/Spinner";
import Button from "@/components/atoms/Button/Button";
import HudPanel from "@/components/templates/HudPanel/HudPanel";
import { useGetAccountsQuery } from "@/services/accountApi";
import { useGetTransactionsQuery, useDeleteTransactionMutation } from "@/services/transactionApi";
import styles from "./AccountPage.module.css";

const AccountPage = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const { data: accounts = [], isLoading: accountsLoading } = useGetAccountsQuery();
  const { data: transactions = [], isLoading: txLoading } = useGetTransactionsQuery({ accountId: id });
  const [deleteTransaction] = useDeleteTransactionMutation();

  const account = accounts.find((a) => a._id === id) ?? accounts[0];
  const isLoading = accountsLoading || txLoading;

  if (isLoading) return <Spinner />;
  if (!account) return null;

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
          <div>
            <h1 className={styles.name}>{account.name}</h1>
            <span className={styles.balance}>
              {account.balance.toLocaleString()} {account.currency}
            </span>
          </div>
          <Button type="button" onClick={() => setIsCreating(true)}>
            + Add
          </Button>
        </div>
        <HudPanel>
          <TransactionList
            transactions={transactions}
            currency={account.currency}
            onTransactionClick={setSelectedTransaction}
          />
        </HudPanel>
      </div>
    </>
  );
};

export default AccountPage;
