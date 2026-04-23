import type { Currency } from "shared";
import type { RecurringPayment } from "@/types";
import Amount from "@/components/atoms/Amount/Amount";
import AccentPanel from "@/components/templates/AccentPanel/AccentPanel";
import styles from "./RecurringPaymentItem.module.css";

interface RecurringPaymentItemProps {
  isLoading: boolean;
  payment: RecurringPayment;
  currency: Currency;
  onClick?: () => void;
}

const RecurringPaymentItem = ({
  isLoading = false,
  payment,
  currency,
  onClick,
}: RecurringPaymentItemProps) => {
  const dueDate = new Date(payment.nextDueDate).toLocaleDateString();

  const content = (
    <AccentPanel className={styles.payment} isLoading={isLoading}>
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
    </AccentPanel>
  );

  return (
    <li className={styles.item}>
      {onClick ? (
        <button type="button" className={styles.button} onClick={onClick}>
          {content}
        </button>
      ) : (
        content
      )}
    </li>
  );
};

export default RecurringPaymentItem;
