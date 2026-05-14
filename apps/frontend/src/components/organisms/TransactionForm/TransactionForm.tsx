import { useState } from "react";
import type { TransactionType } from "shared";
import type { Transaction } from "@/types";
import CategoryPicker from "@/components/molecules/CategoryPicker/CategoryPicker";
import FormActions from "@/components/molecules/FormActions/FormActions";
import Input from "@/components/atoms/Input/Input";
import {
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
} from "@/services/transactionApi";
import { useGetCategoriesQuery } from "@/services/categoryApi";
import styles from "./TransactionForm.module.css";

interface TransactionFormProps {
  transaction?: Transaction;
  accountId?: string;
  onClose: () => void;
  onDelete?: () => void;
}

const TransactionForm = ({
  transaction,
  accountId,
  onClose,
  onDelete,
}: TransactionFormProps) => {
  const today = new Date().toISOString().slice(0, 10);
  const { data: categories = [] } = useGetCategoriesQuery();

  const [type, setType] = useState<TransactionType>(
    transaction?.type ?? "expense",
  );
  const [amount, setAmount] = useState(String(transaction?.amount ?? ""));
  const [category, setCategory] = useState(transaction?.category ?? "");
  const [description, setDescription] = useState(
    transaction?.description ?? "",
  );
  const [date, setDate] = useState(transaction?.date.slice(0, 10) ?? today);

  const [createTransaction] = useCreateTransactionMutation({
    fixedCacheKey: "create-transaction",
  });
  const [updateTransaction] = useUpdateTransactionMutation({
    fixedCacheKey: "update-transaction",
  });

  const filteredCategories = categories.filter((c) => c.type === type)

  const effectiveCategory = category || filteredCategories[0]?._id || "";

  const handleTypeChange = (next: TransactionType) => {
    setType(next);
    const firstOfType = categories.find((c) => c.type === next);
    setCategory(firstOfType?._id ?? "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      amount: Number.parseFloat(amount),
      type,
      category: effectiveCategory,
      description: description || undefined,
      date,
    };
    try {
      if (transaction) {
        await updateTransaction({
          id: transaction._id,
          body: { ...body, account: transaction.account },
        }).unwrap();
      } else {
        await createTransaction({ ...body, account: accountId! }).unwrap();
      }
      onClose();
    } catch {
      // error visible via fixedCacheKey in TransactionList
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.typeToggle}>
        <button
          type="button"
          className={[
            styles.typeBtn,
            type === "income" ? styles.income : "",
          ].join(" ")}
          onClick={() => handleTypeChange("income")}
        >
          Income
        </button>
        <button
          type="button"
          className={[
            styles.typeBtn,
            type === "expense" ? styles.expense : "",
          ].join(" ")}
          onClick={() => handleTypeChange("expense")}
        >
          Expense
        </button>
      </div>
      <Input
        type="text"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        inputMode="decimal"
        required
      />
      <CategoryPicker
        categories={filteredCategories}
        value={effectiveCategory}
        onChange={setCategory}
      />
      <Input
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <FormActions
        onCancel={onClose}
        onDelete={onDelete}
        submitLabel={transaction ? "Save" : "Create"}
      />
    </form>
  );
};

export default TransactionForm;
