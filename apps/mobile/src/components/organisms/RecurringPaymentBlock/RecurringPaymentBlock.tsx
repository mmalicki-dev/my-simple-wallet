import { View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type {
  BillingCycle,
  Currency,
  RecurringPayment,
  RecurringPaymentType,
} from "shared";
import { useGetAccountsQuery, useGetExchangeRatesQuery } from "@/services";
import { useAppSelector, useColors } from "@/hooks";
import { RecurringPaymentItem } from "@/components/molecules/RecurringPaymentItem/RecurringPaymentItem";
import { Amount } from "@/components/atoms/Amount/Amount";
import type { RootStackParamList } from "@/navigation";

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const MONTHLY_FACTOR: Record<BillingCycle, number> = {
  weekly: 52 / 12,
  monthly: 1,
  yearly: 1 / 12,
};

const LABELS: Record<RecurringPaymentType, string> = {
  loan: "Your loans",
  subscription: "Your subscriptions",
};

interface RecurringPaymentBlockProps {
  type: RecurringPaymentType;
  payments: RecurringPayment[];
}

export const RecurringPaymentBlock = ({
  type,
  payments,
}: RecurringPaymentBlockProps) => {
  const colors = useColors();
  const navigation = useNavigation<NavProp>();
  const { data: accounts = [] } = useGetAccountsQuery();
  const baseCurrency = useAppSelector(
    (state) => state.auth.user?.totalBalanceCurrency,
  );

  const active = payments.filter((p) => p.isActive);

  const activeCurrencies = [
    ...new Set(
      active.map(
        (p) => accounts.find((a) => a._id === p.account)?.currency ?? "USD",
      ),
    ),
  ] as Currency[];

  const allSameCurrency =
    activeCurrencies.length === 1 && activeCurrencies[0] === baseCurrency;

  const displayCurrency: Currency =
    baseCurrency ?? activeCurrencies[0] ?? "USD";

  const { data: ratesData, isLoading: ratesLoading } = useGetExchangeRatesQuery(
    displayCurrency,
    { skip: !baseCurrency || allSameCurrency || active.length === 0 },
  );

  const monthlyTotal = active.reduce((sum, p) => {
    const monthly = p.amount * MONTHLY_FACTOR[p.billingCycle];
    const currency =
      accounts.find((a) => a._id === p.account)?.currency ?? displayCurrency;
    if (currency === displayCurrency) return sum + monthly;
    const rate = ratesData?.rates[currency];
    return rate ? sum + monthly / rate : sum + monthly;
  }, 0);

  if (payments.length === 0) return null;

  return (
    <>
      {active.length > 0 && !ratesLoading && (
        <View style={styles.totalRight}>
          <Amount
            value={-monthlyTotal}
            currency={displayCurrency}
            style={[styles.totalAmount, { color: colors.danger }]}
          />
          <Text style={[styles.period, { color: colors.danger }]}>/mo</Text>
        </View>
      )}
      <View style={styles.list}>
        {payments.map((payment) => (
          <RecurringPaymentItem
            key={payment._id}
            payment={payment}
            currency={
              accounts.find((a) => a._id === payment.account)?.currency ??
              displayCurrency
            }
            accountName={
              accounts.find((a) => a._id === payment.account)?.name ?? "unknown"
            }
            onEdit={() => navigation.navigate("Recurring")}
            onDelete={() => navigation.navigate("Recurring")}
          />
        ))}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  totalRight: {
    position: "absolute",
    top: -20,
    right: 0,
    flexDirection: "row",
    alignItems: "baseline",
    gap: 2,
  },
  totalAmount: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.8,
  },
  period: {
    fontSize: 10,
    fontWeight: "400",
  },
  list: {
    gap: 2,
  },
});
