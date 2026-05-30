import { useEffect, useState } from "react";
import type { TransactionType, Transaction } from "shared";
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
import { useGetAccountsQuery } from "@/services/accountApi";

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
  const { data: accounts = [] } = useGetAccountsQuery();
  const defaultAccount = accounts.find((a) => a.isDefault) ?? accounts[0];

  const [form, setForm] = useState({
    type: transaction?.type ?? "expense",
    amount: String(transaction?.amount ?? ""),
    category: transaction?.category ?? "",
    description: transaction?.description ?? "",
    date: transaction?.date.slice(0, 10) ?? today,
    account: transaction?.account ?? accountId ?? defaultAccount?._id ?? "",
  });

  useEffect(() => {
    if (
      !accountId &&
      !transaction?.account &&
      !form.account &&
      defaultAccount
    ) {
      setForm((prev) => ({ ...prev, account: defaultAccount._id }));
    }
  }, [defaultAccount?._id]);

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
    setForm((prev) => ({
      ...prev,
      type: next,
      category: firstOfType?._id ?? "",
    }));
  };

  const handleSubmit = async () => {
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
        await createTransaction({
          ...body,
          account: accountId ?? form.account,
        }).unwrap();
      }
      onClose();
    } catch {
      // error visible via fixedCacheKey in TransactionList
    }
  };

  const accountOptions = accounts.map((a) => ({ value: a._id, label: a.name }));

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
      {!accountId && (
        <FormInput
          type="select"
          id="account"
          label="Account"
          placeholder="Select account"
          value={form.account}
          optionsArray={accountOptions}
          handleChange={handleChange}
        />
      )}
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
