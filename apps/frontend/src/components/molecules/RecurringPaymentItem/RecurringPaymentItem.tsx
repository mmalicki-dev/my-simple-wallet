import type { RecurringPayment } from "@/types";
import styles from "./RecurringPaymentItem.module.css";
import AccentPanel from "@/components/templates/AccentPanel/AccentPanel";

interface RecurringPaymentItemProps {
  payment: RecurringPayment;
  onClick?: () => void;
}

const RecurringPaymentItem = ({
  payment,
  onClick,
}: RecurringPaymentItemProps) => {
  const dueDate = new Date(payment.nextDueDate).toLocaleDateString();

  const content = (
    <AccentPanel className={styles.payment}>
      <div className={styles.info}>
        <span className={styles.name}>{payment.name}</span>
        <span className={styles.meta}>
          {payment.billingCycle} · due {dueDate}
        </span>
      </div>
      <span className={styles.amount}>{payment.amount}</span>
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
