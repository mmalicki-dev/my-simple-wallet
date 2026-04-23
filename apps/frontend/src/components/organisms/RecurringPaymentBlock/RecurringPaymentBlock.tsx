import { useState } from "react";
import type { RecurringPayment, RecurringPaymentType } from "@/types";
import { useGetAccountsQuery } from "@/services/accountApi";
import RecurringPaymentItem from "@/components/molecules/RecurringPaymentItem/RecurringPaymentItem";
import styles from "./RecurringPaymentBlock.module.css";
import PanelLabel from "@/components/atoms/PanelLabel/PanelLabel";
import { useGetRecurringPaymentsQuery } from "@/services";

const PREVIEW_COUNT = 2;

interface RecurringPaymentBlockProps {
  type: RecurringPaymentType;
  payments: RecurringPayment[];
  onItemClick: (payment: RecurringPayment) => void;
}

const LABELS: Record<RecurringPaymentType, string> = {
  loan: "Your loans",
  subscription: "Your subscriptions",
};

const RecurringPaymentBlock = ({
  type,
  payments,
  onItemClick,
}: RecurringPaymentBlockProps) => {
  const { isLoading: paymentsLoading } = useGetRecurringPaymentsQuery();
  const { data: accounts = [], isLoading: accountsLoading } =
    useGetAccountsQuery();
  const [expanded, setExpanded] = useState(false);

  const hasMore = payments.length > PREVIEW_COUNT;
  const visible = expanded ? payments : payments.slice(0, PREVIEW_COUNT);

  return (
    <section className={styles.block}>
      <PanelLabel label={LABELS[type]} />
      <ul className={styles.list}>
        {visible.map((payment) => (
          <RecurringPaymentItem
            key={payment._id}
            payment={payment}
            currency={
              accounts.find((a) => a._id === payment.account)?.currency ?? "USD"
            }
            onClick={() => onItemClick(payment)}
            isLoading={accountsLoading && paymentsLoading}
          />
        ))}
      </ul>
      {hasMore && (
        <button
          type="button"
          className={styles.expandButton}
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? "Show less" : "···"}
        </button>
      )}
    </section>
  );
};

export default RecurringPaymentBlock;
