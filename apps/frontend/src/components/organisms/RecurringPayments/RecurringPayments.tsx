import { useState } from "react";
import type { RecurringPayment } from "@/types";
import { useGetRecurringPaymentsQuery } from "@/services/recurringPaymentApi";
import RecurringPaymentBlock from "@/components/organisms/RecurringPaymentBlock/RecurringPaymentBlock";
import Modal from "@/components/templates/Modal/Modal";
import EditRecurringPaymentForm from "@/components/organisms/EditRecurringPaymentForm/EditRecurringPaymentForm";
import Spinner from "@/components/atoms/Spinner/Spinner";
import styles from "./RecurringPayments.module.css";
import HudPanel from "@/components/templates/HudPanel/HudPanel";

const RecurringPayments = () => {
  const { data = [], isLoading } = useGetRecurringPaymentsQuery();
  const [selected, setSelected] = useState<RecurringPayment | null>(null);

  const loans = data.filter((p) => p.type === "loan");
  const subscriptions = data.filter((p) => p.type === "subscription");

  if (isLoading) return <Spinner />;
  if (loans.length === 0 && subscriptions.length === 0) return null;

  return (
    <>
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title="Edit payment"
      >
        {selected && (
          <EditRecurringPaymentForm
            payment={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </Modal>
      {loans.length > 0 && (
        <HudPanel>
          <RecurringPaymentBlock
            type="loan"
            payments={loans}
            onItemClick={setSelected}
          />
        </HudPanel>
      )}
      {subscriptions.length > 0 && (
        <HudPanel>
          <RecurringPaymentBlock
            type="subscription"
            payments={subscriptions}
            onItemClick={setSelected}
          />
        </HudPanel>
      )}
    </>
  );
};

export default RecurringPayments;
