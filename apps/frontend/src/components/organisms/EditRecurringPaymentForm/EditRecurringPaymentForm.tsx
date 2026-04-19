import { useState } from "react";
import type {
  RecurringPayment,
  RecurringPaymentType,
  BillingCycle,
} from "@/types";
import { RECURRING_PAYMENT_TYPES } from "shared";
import Input from "@/components/atoms/Input/Input";
import SelectOption from "@/components/atoms/SelectOption/SelectOption";
import Checkbox from "@/components/atoms/Checkbox/Checkbox";
import Button from "@/components/atoms/Button/Button";
import styles from "./EditRecurringPaymentForm.module.css";
import { useUpdateRecurringPaymentMutation } from "@/services";

interface EditRecurringPaymentFormProps {
  payment: RecurringPayment;
  onClose: () => void;
  onDelete: () => void;
}

const BILLING_CYCLE_OPTIONS: { value: BillingCycle; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

const EditRecurringPaymentForm = ({
  payment,
  onClose,
  onDelete,
}: EditRecurringPaymentFormProps) => {
  const [type, setType] = useState<RecurringPaymentType>(payment.type);
  const [name, setName] = useState(payment.name);
  const [amount, setAmount] = useState(String(payment.amount));
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(
    payment.billingCycle,
  );
  const [nextDueDate, setNextDueDate] = useState(
    payment.nextDueDate.slice(0, 10),
  );
  const [description, setDescription] = useState(payment.description ?? "");
  const [isActive, setIsActive] = useState(payment.isActive);
  const [updateRecurringPayment] = useUpdateRecurringPaymentMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateRecurringPayment({
      id: payment._id,
      body: {
        name: payment.name,
        type: payment.type,
        amount: payment.amount,
        account: payment.account,
        category: payment.category,
        billingCycle: payment.billingCycle,
        nextDueDate: payment.nextDueDate,
        description: payment.description,
        isActive: payment.isActive,
      },
    });
    onClose();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
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
      <Input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <Input
        type="text"
        placeholder="Amount"
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
      <Input
        type="date"
        value={nextDueDate}
        onChange={(e) => setNextDueDate(e.target.value)}
        required
      />
      <Input
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Checkbox
        id="isActive"
        label="Active"
        checked={isActive}
        onChange={(e) => setIsActive(e.target.checked)}
      />
      <div className={styles.actions}>
        <Button type="button" variant="danger" onClick={onDelete}>
          Delete
        </Button>
        <div className={styles.right}>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </div>
    </form>
  );
};

export default EditRecurringPaymentForm;
