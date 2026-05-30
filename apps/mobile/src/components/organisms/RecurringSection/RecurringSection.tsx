import { useState } from "react";
import type { RecurringPayment, RecurringPaymentType } from "shared";
import BottomSheet from "@/components/templates/BottomSheet/BottomSheet";
import UserSectionList from "@/components/organisms/UserSectionList/UserSectionList";
import UserSectionItem from "@/components/molecules/UserSectionItem/UserSectionItem";
import RecurringPaymentForm from "@/components/organisms/RecurringPaymentForm/RecurringPaymentForm";
import { SkeletonLoader } from "@/components/atoms/SkeletonLoader/SkeletonLoader";
import { useGetRecurringPaymentsQuery } from "@/services/recurringPaymentApi";

const RecurringSection = () => {
  const { data: payments = [], isLoading } = useGetRecurringPaymentsQuery();
  const [selected, setSelected] = useState<RecurringPayment | null>(null);
  const [addingType, setAddingType] = useState<RecurringPaymentType | null>(
    null,
  );

  if (isLoading) return <SkeletonLoader />;

  const subscriptions = payments.filter((p) => p.type === "subscription");
  const loans = payments.filter((p) => p.type === "loan");

  const renderItem = (payment: RecurringPayment) => (
    <UserSectionItem
      key={payment._id}
      label={payment.name}
      subtitle={`${payment.amount.toLocaleString()} · ${payment.billingCycle}`}
      onEdit={() => setSelected(payment)}
    />
  );

  return (
    <>
      <BottomSheet
        isVisible={!!addingType}
        title="New Recurring Payment"
        onClose={() => setAddingType(null)}
      >
        <RecurringPaymentForm
          defaultType={addingType ?? "subscription"}
          onClose={() => setAddingType(null)}
        />
      </BottomSheet>
      <BottomSheet
        isVisible={!!selected}
        title="Edit Recurring Payment"
        onClose={() => setSelected(null)}
      >
        {selected && (
          <RecurringPaymentForm
            payment={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </BottomSheet>
      <UserSectionList
        title="Subscriptions"
        onAdd={() => setAddingType("subscription")}
      >
        {subscriptions.map(renderItem)}
      </UserSectionList>
      <UserSectionList title="Loans" onAdd={() => setAddingType("loan")}>
        {loans.map(renderItem)}
      </UserSectionList>
    </>
  );
};

export default RecurringSection;
