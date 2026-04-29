import { useState } from "react";
import type { RecurringPayment, RecurringPaymentType } from "@/types";
import { useGetAccountsQuery } from "@/services/accountApi";
import RecurringPaymentItem from "@/components/molecules/RecurringPaymentItem/RecurringPaymentItem";
import styles from "./RecurringPaymentBlock.module.css";
import PanelLabel from "@/components/atoms/PanelLabel/PanelLabel";
import { useGetRecurringPaymentsQuery } from "@/services";
import Icon from "@/components/atoms/Icon/Icon";
import SkeletonLoader from "@/components/atoms/SkeletonLoader/SkeletonLoader";

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

  if (paymentsLoading || accountsLoading) return <SkeletonLoader count={2} />;

  const hasMore = payments.length > PREVIEW_COUNT;
  const preview = payments.slice(0, PREVIEW_COUNT);
  const extra = payments.slice(PREVIEW_COUNT);

  const renderItem = (payment: RecurringPayment) => (
    <RecurringPaymentItem
      key={payment._id}
      payment={payment}
      currency={accounts.find((a) => a._id === payment.account)?.currency ?? "USD"}
      onClick={() => onItemClick(payment)}
      isLoading={accountsLoading && paymentsLoading}
    />
  );

  return (
    <section className={styles.block}>
      <PanelLabel label={LABELS[type]} />
      <ul className={styles.list}>
        {preview.map(renderItem)}
      </ul>
      {hasMore && (
        <div
          className={styles.extraWrapper}
          style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
        >
          <ul className={styles.extraList}>
            {extra.map(renderItem)}
          </ul>
        </div>
      )}
      {hasMore && (
        <button
          type="button"
          className={styles.expandButton}
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? (
            <Icon name="arrow-down" className={styles.arrowUp} />
          ) : (
            <Icon name="arrow-down" className={styles.arrowDown} />
          )}
        </button>
      )}
    </section>
  );
};

export default RecurringPaymentBlock;
