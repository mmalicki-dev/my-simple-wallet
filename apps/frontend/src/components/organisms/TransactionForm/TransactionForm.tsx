import { useState } from "react";
import type { TransactionType } from "shared";
import type { Transaction } from "@/types";
import CategoryPicker from "@/components/molecules/CategoryPicker/CategoryPicker";
import FormActions from "@/components/molecules/FormActions/FormActions";
import FormInput from "@/components/atoms/FormInput/FormInput";
import Toggle from "@/components/molecules/Toggle/Toggle";
import Form from "../Form/Form";
import {
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
} from "@/services/transactionApi";
import { useGetCategoriesQuery } from "@/services/categoryApi";

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

  const [form, setForm] = useState({
    type: (transaction?.type ?? "expense") as TransactionType,
    amount: String(transaction?.amount ?? ""),
    category: transaction?.category ?? "",
    description: transaction?.description ?? "",
    date: transaction?.date.slice(0, 10) ?? today,
  });

  const [createTransaction] = useCreateTransactionMutation({
    fixedCacheKey: "create-transaction",
  });
  const [updateTransaction] = useUpdateTransactionMutation({
    fixedCacheKey: "update-transaction",
  });

  const filteredCategories = categories.filter((c) => c.type === form.type);
  const effectiveCategory = form.category || filteredCategories[0]?._id || "";

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTypeChange = (next: TransactionType) => {
    const firstOfType = categories.find((c) => c.type === next);
    setForm((prev) => ({ ...prev, type: next, category: firstOfType?._id ?? "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      amount: Number.parseFloat(form.amount),
      type: form.type,
      category: effectiveCategory,
      description: form.description || undefined,
      date: form.date,
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
    <Form
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      header={
        <Toggle
          options={[
            { value: "income", label: "Income" },
            { value: "expense", label: "Expense" },
          ]}
          value={form.type}
          onChange={(val) => handleTypeChange(val as TransactionType)}
        />
      }
      inputsArray={[
        {
          type: "text",
          id: "amount",
          label: "Amount",
          placeholder: "0.00",
          handleChange,
          value: form.amount,
        },
      ]}
    >
      <CategoryPicker
        categories={filteredCategories}
        value={effectiveCategory}
        onChange={(id) => setForm((prev) => ({ ...prev, category: id }))}
      />
      <FormInput
        type="text"
        id="description"
        label="Description"
        placeholder="Optional"
        value={form.description}
        isOptional
        handleChange={handleChange}
      />
      <FormInput
        type="date"
        id="date"
        label="Date"
        placeholder=""
        value={form.date}
        handleChange={handleChange}
      />
      <FormActions
        onCancel={onClose}
        onDelete={onDelete}
        submitLabel={transaction ? "Save" : "Create"}
      />
    </Form>
  );
};

export default TransactionForm;
