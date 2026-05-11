import { useState } from "react";
import type {
  RecurringPayment,
  RecurringPaymentType,
  BillingCycle,
} from "@/types";
import { RECURRING_PAYMENT_TYPES } from "shared";
import FormField from "@/components/molecules/FormField/FormField";
import FormActions from "@/components/molecules/FormActions/FormActions";
import Input from "@/components/atoms/Input/Input";
import SelectOption from "@/components/atoms/SelectOption/SelectOption";
import Checkbox from "@/components/atoms/Checkbox/Checkbox";
import {
  useCreateRecurringPaymentMutation,
  useUpdateRecurringPaymentMutation,
  useDeleteRecurringPaymentMutation,
} from "@/services/recurringPaymentApi";
import { useGetAccountsQuery } from "@/services/accountApi";
import { useGetCategoriesQuery } from "@/services/categoryApi";
import styles from "./EditRecurringPaymentForm.module.css";

interface EditRecurringPaymentFormProps {
  payment?: RecurringPayment;
  defaultType?: RecurringPaymentType;
  onClose: () => void;
}

const BILLING_CYCLE_OPTIONS: { value: BillingCycle; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

const EditRecurringPaymentForm = ({
  payment,
  defaultType,
  onClose,
}: EditRecurringPaymentFormProps) => {
  const { data: accounts = [] } = useGetAccountsQuery();
  const { data: categories = [] } = useGetCategoriesQuery();

  const [type, setType] = useState<RecurringPaymentType>(
    payment?.type ?? defaultType ?? "subscription",
  );
  const [name, setName] = useState(payment?.name ?? "");
  const [amount, setAmount] = useState(String(payment?.amount ?? ""));
  const [account, setAccount] = useState(
    payment?.account ?? accounts[0]?._id ?? "",
  );
  const [category, setCategory] = useState(
    payment?.category ?? categories[0]?._id ?? "",
  );
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(
    payment?.billingCycle ?? "monthly",
  );
  const [nextDueDate, setNextDueDate] = useState(
    payment?.nextDueDate?.slice(0, 10) ?? "",
  );
  const [description, setDescription] = useState(payment?.description ?? "");
  const [isActive, setIsActive] = useState(payment?.isActive ?? true);

  const [createRecurringPayment] = useCreateRecurringPaymentMutation();
  const [updateRecurringPayment] = useUpdateRecurringPaymentMutation();
  const [deleteRecurringPayment] = useDeleteRecurringPaymentMutation();

  const accountOptions = accounts.map((a) => ({ value: a._id, label: a.name }));
  const categoryOptions = categories.map((c) => ({
    value: c._id,
    label: c.name,
  }));

  const selectedAccount = accounts.find((a) => a._id === account);
  const amountLabel = selectedAccount
    ? `Amount / Cycle (${selectedAccount.currency})`
    : "Amount / Cycle";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      name,
      type,
      amount: Number.parseFloat(amount),
      account,
      category,
      billingCycle,
      nextDueDate,
      description: description || undefined,
      isActive,
    };
    if (payment) {
      await updateRecurringPayment({ id: payment._id, body });
    } else {
      await createRecurringPayment(body);
    }
    onClose();
  };

  const handleDelete = async () => {
    if (!payment) return;
    await deleteRecurringPayment({ id: payment._id });
    onClose();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <FormField label="Type" variant="neon">
        <div className={styles.typeToggle}>
          {RECURRING_PAYMENT_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              className={[styles.typeBtn, type === t ? styles.active : ""].join(
                " ",
              )}
              onClick={() => setType(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </FormField>
      <FormField label="Name" variant="neon">
        <Input
          type="text"
          placeholder="e.g. Netflix"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </FormField>
      <FormField label={amountLabel} variant="neon">
        <div className={styles.row}>
          <Input
            type="text"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="decimal"
            required
          />
          <SelectOption
            value={billingCycle}
            options={BILLING_CYCLE_OPTIONS}
            onChange={(e) => setBillingCycle(e.target.value as BillingCycle)}
          />
        </div>
      </FormField>
      <FormField label="Account / Category" variant="neon">
        <div className={styles.row}>
          <SelectOption
            value={account}
            options={accountOptions}
            onChange={(e) => setAccount(e.target.value)}
          />
          <SelectOption
            value={category}
            options={categoryOptions}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
      </FormField>
      <FormField label="Next Due Date" variant="neon">
        <Input
          type="date"
          value={nextDueDate}
          onChange={(e) => setNextDueDate(e.target.value)}
          required
        />
      </FormField>
      <FormField label="Notes" variant="neon">
        <Input
          type="text"
          placeholder="Optional"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </FormField>
      {payment && (
        <>
          <div className={styles.divider} />
          <div className={styles.statusRow}>
            <div
              className={[styles.statusDot, !isActive && styles.statusDotOff]
                .filter(Boolean)
                .join(" ")}
            />
            <Checkbox
              id="isActive"
              label="Active"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
          </div>
        </>
      )}
      <FormActions
        onCancel={onClose}
        onDelete={payment ? handleDelete : undefined}
        submitLabel={payment ? "Save" : "Create"}
        divider
      />
    </form>
  );
};

export default EditRecurringPaymentForm;
