import { useState } from "react";
import type { Currency } from "shared";
import type { RecurringPayment } from "@/types";
import Amount from "@/components/atoms/Amount/Amount";
import AccentPanel from "@/components/templates/AccentPanel/AccentPanel";
import QuickActions from "@/components/molecules/QuickActions/QuickActions";
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
  const [isOpen, setIsOpen] = useState(false);
  const dueDate = new Date(payment.nextDueDate).toLocaleDateString();

  return (
    <li
      className={styles.item}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className={styles.wrapper}>
        <AccentPanel className={styles.payment}>
          <button
            className={styles.content}
            onClick={() => setIsOpen((t) => !t)}
            tabIndex={0}
          >
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
          </button>
        </AccentPanel>
        <QuickActions
          isOpen={isOpen}
          onViewMore={onViewMore}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </li>
  );
};

export default RecurringPaymentItem;
