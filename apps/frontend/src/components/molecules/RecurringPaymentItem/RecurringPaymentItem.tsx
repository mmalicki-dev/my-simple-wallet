import type { Currency } from "shared";
import type { RecurringPayment } from "@/types";
import Amount from "@/components/atoms/Amount/Amount";
import ActionPanel from "@/components/molecules/ActionPanel/ActionPanel";
import styles from "./RecurringPaymentItem.module.css";

interface RecurringPaymentItemProps {
  payment: RecurringPayment;
  currency: Currency;
  onViewMore?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const RecurringPaymentItem = ({
  payment,
  currency,
  onViewMore,
  onEdit,
  onDelete,
}: RecurringPaymentItemProps) => {
  const dueDate = new Date(payment.nextDueDate).toLocaleDateString();

  return (
    <li className={styles.item}>
      <ActionPanel
        className={styles.payment}
        onViewMore={onViewMore}
        onEdit={onEdit}
        onDelete={onDelete}
      >
        <div className={styles.content}>
          <div className={styles.info}>
            <span className={styles.name}>{payment.name}</span>
            <span className={styles.meta}>
              {payment.billingCycle} · due {dueDate}
            </span>
          </div>
          <Amount
            value={payment.amount}
            currency={currency}
            className={styles.amount}
          />
        </div>
      </ActionPanel>
    </li>
  );
};

export default RecurringPaymentItem;
