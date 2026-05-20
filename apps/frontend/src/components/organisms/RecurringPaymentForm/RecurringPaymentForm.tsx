import { useState } from "react";
import type {
  RecurringPayment,
  RecurringPaymentType,
  BillingCycle,
} from "shared";
import { RECURRING_PAYMENT_TYPES } from "shared";
import CustomSelect from "@/components/atoms/CustomSelect/CustomSelect";
import FormInput from "@/components/atoms/FormInput/FormInput";
import Input from "@/components/atoms/Input/Input";
import Checkbox from "@/components/atoms/Checkbox/Checkbox";
import FormActions from "@/components/molecules/FormActions/FormActions";
import FormField from "@/components/molecules/FormField/FormField";
import Toggle from "@/components/molecules/Toggle/Toggle";
import Form from "../Form/Form";
import {
  useCreateRecurringPaymentMutation,
  useUpdateRecurringPaymentMutation,
  useDeleteRecurringPaymentMutation,
} from "@/services/recurringPaymentApi";
import { useGetAccountsQuery } from "@/services/accountApi";
import { useGetCategoriesQuery } from "@/services/categoryApi";
import styles from "./RecurringPaymentForm.module.css";

interface RecurringPaymentFormProps {
  payment?: RecurringPayment;
  defaultType?: RecurringPaymentType;
  onClose: () => void;
}

const BILLING_CYCLE_OPTIONS: { value: BillingCycle; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

const RecurringPaymentForm = ({
  payment,
  defaultType,
  onClose,
}: RecurringPaymentFormProps) => {
  const { data: accounts = [] } = useGetAccountsQuery();
  const { data: categories = [] } = useGetCategoriesQuery();

  const [form, setForm] = useState({
    type: payment?.type ?? defaultType ?? "subscription",
    name: payment?.name ?? "",
    amount: String(payment?.amount ?? ""),
    account: payment?.account ?? accounts[0]?._id ?? "",
    category: payment?.category ?? categories[0]?._id ?? "",
    billingCycle: payment?.billingCycle ?? "monthly",
    nextDueDate: payment?.nextDueDate?.slice(0, 10) ?? "",
    description: payment?.description ?? "",
  });
  const [isActive, setIsActive] = useState(payment?.isActive ?? true);

  const [createRecurringPayment] = useCreateRecurringPaymentMutation();
  const [updateRecurringPayment] = useUpdateRecurringPaymentMutation();
  const [deleteRecurringPayment] = useDeleteRecurringPaymentMutation();

  const accountOptions = accounts.map((a) => ({ value: a._id, label: a.name }));
  const categoryOptions = categories.map((c) => ({
    value: c._id,
    label: c.name,
  }));
  const selectedAccount = accounts.find((a) => a._id === form.account);
  const amountLabel = selectedAccount
    ? `Amount / Cycle (${selectedAccount.currency})`
    : "Amount / Cycle";

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      name: form.name,
      type: form.type,
      amount: Number.parseFloat(form.amount),
      account: form.account,
      category: form.category,
      billingCycle: form.billingCycle,
      nextDueDate: form.nextDueDate,
      description: form.description || undefined,
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
    <Form
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      header={
        <Toggle
          options={[...RECURRING_PAYMENT_TYPES].map((t) => ({
            value: t,
            label: t.charAt(0).toUpperCase() + t.slice(1),
          }))}
          value={form.type}
          onChange={(val) =>
            setForm((prev) => ({ ...prev, type: val as RecurringPaymentType }))
          }
        />
      }
      inputsArray={[
        {
          type: "text",
          id: "name",
          label: "Name",
          placeholder: "e.g. Netflix",
          handleChange,
          value: form.name,
        },
      ]}
    >
      <FormField label={amountLabel} variant="neon">
        <div className={styles.row}>
          <Input
            type="text"
            name="amount"
            placeholder="0.00"
            value={form.amount}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, amount: e.target.value }))
            }
            inputMode="decimal"
            required
          />
          <CustomSelect
            value={form.billingCycle}
            options={BILLING_CYCLE_OPTIONS}
            onChange={(val) =>
              setForm((prev) => ({
                ...prev,
                billingCycle: val as BillingCycle,
              }))
            }
          />
        </div>
      </FormField>
      <FormField label="Account / Category" variant="neon">
        <div className={styles.row}>
          <CustomSelect
            value={form.account}
            options={accountOptions}
            onChange={(val) => setForm((prev) => ({ ...prev, account: val }))}
          />
          <CustomSelect
            value={form.category}
            options={categoryOptions}
            onChange={(val) => setForm((prev) => ({ ...prev, category: val }))}
          />
        </div>
      </FormField>
      <FormInput
        type="date"
        id="nextDueDate"
        label="Next Due Date"
        placeholder=""
        value={form.nextDueDate}
        handleChange={handleChange}
      />
      <FormInput
        type="text"
        id="description"
        label="Notes"
        placeholder="Optional"
        value={form.description}
        isOptional
        handleChange={handleChange}
      />
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
    </Form>
  );
};

export default RecurringPaymentForm;
