import { View, Text, StyleSheet } from "react-native";
import type { Currency, RecurringPayment } from "shared";
import { ActionPanel } from "@/components/molecules/ActionPanel/ActionPanel";
import { Amount } from "@/components/atoms/Amount/Amount";
import { useColors } from "@/hooks";

interface RecurringPaymentItemProps {
  payment: RecurringPayment;
  currency: Currency;
  accountName: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const RecurringPaymentItem = ({
  payment,
  currency,
  accountName,
  onEdit,
  onDelete,
}: RecurringPaymentItemProps) => {
  const colors = useColors();
  const dueDate = new Date(payment.nextDueDate).toLocaleDateString();

  return (
    <ActionPanel withBorderBottom onEdit={onEdit} onDelete={onDelete}>
      <View style={styles.content}>
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.text }]}>
            {payment.name}
          </Text>
          <Text style={[styles.meta, { color: colors.textMuted }]}>
            {payment.billingCycle} · due {dueDate} · {accountName}
          </Text>
        </View>
        <Amount
          value={payment.amount}
          currency={currency}
          style={[styles.amount, { color: colors.primary }]}
        />
      </View>
    </ActionPanel>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingRight: 8,
  },
  info: {
    gap: 3,
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 11,
    fontWeight: "400",
  },
  meta: {
    fontSize: 10,
    fontWeight: "400",
  },
  amount: {
    fontSize: 13,
    fontWeight: "600",
  },
});
