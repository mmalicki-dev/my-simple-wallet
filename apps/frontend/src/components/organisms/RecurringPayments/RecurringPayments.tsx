import { useState } from "react";
import type { RecurringPayment, RecurringPaymentType } from "@/types";
import { useGetRecurringPaymentsQuery } from "@/services/recurringPaymentApi";
import RecurringPaymentBlock from "@/components/organisms/RecurringPaymentBlock/RecurringPaymentBlock";
import EditRecurringPaymentForm from "@/components/organisms/EditRecurringPaymentForm/EditRecurringPaymentForm";
import Spinner from "@/components/atoms/Spinner/Spinner";
import HudPanel from "@/components/templates/HudPanel/HudPanel";

interface SectionProps {
  type: RecurringPaymentType;
  payments: RecurringPayment[];
  selected: RecurringPayment | null;
  onSelect: (payment: RecurringPayment) => void;
  onClose: () => void;
}

const RecurringPaymentSection = ({
  type,
  payments,
  selected,
  onSelect,
  onClose,
}: SectionProps) => (
  <HudPanel>
    {selected?.type === type ? (
      <EditRecurringPaymentForm payment={selected} onClose={onClose} />
    ) : (
      <RecurringPaymentBlock
        type={type}
        payments={payments}
        onItemClick={onSelect}
      />
    )}
  </HudPanel>
);

const RecurringPayments = () => {
  const { data = [], isLoading } = useGetRecurringPaymentsQuery();
  const [selected, setSelected] = useState<RecurringPayment | null>(null);

  const loans = data.filter((p) => p.type === "loan");
  const subscriptions = data.filter((p) => p.type === "subscription");

  if (isLoading) return <Spinner />;
  if (loans.length === 0 && subscriptions.length === 0) return null;

  return (
    <>
      {loans.length > 0 && (
        <RecurringPaymentSection
          type="loan"
          payments={loans}
          selected={selected}
          onSelect={setSelected}
          onClose={() => setSelected(null)}
        />
      )}
      {subscriptions.length > 0 && (
        <RecurringPaymentSection
          type="subscription"
          payments={subscriptions}
          selected={selected}
          onSelect={setSelected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
};

export default RecurringPayments;
