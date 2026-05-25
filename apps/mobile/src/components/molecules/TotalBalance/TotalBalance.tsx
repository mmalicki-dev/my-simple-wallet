import { Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { Account, Currency } from "shared";
import { useTotalBalance } from "@/hooks/useTotalBalance";
import { Amount } from "@/components/atoms/Amount/Amount";
import { useColors } from "@/hooks";
import type { RootStackParamList } from "@/navigation";
import { ActionPanel } from "../ActionPanel/ActionPanel";

type NavProp = NativeStackNavigationProp<RootStackParamList>;

interface TotalBalanceProps {
  accounts: Account[];
  baseCurrency: Currency;
}

export const TotalBalance = ({ accounts, baseCurrency }: TotalBalanceProps) => {
  const colors = useColors();
  const navigation = useNavigation<NavProp>();
  const { total, isLoading, isError } = useTotalBalance(accounts, baseCurrency);

  return (
    <>
      {isLoading && (
        <Text style={[styles.muted, { color: colors.textMuted }]}>
          Loading…
        </Text>
      )}
      {isError && (
        <Text style={[styles.error, { color: colors.danger }]}>
          Could not load rates
        </Text>
      )}
      {!isLoading && !isError && total !== null && (
        <ActionPanel onEdit={() => navigation.navigate("Profile")}>
          <Amount
            value={total}
            currency={baseCurrency}
            isApproximate
            style={[styles.amount, { color: colors.text }]}
          />
        </ActionPanel>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  amount: {
    fontSize: 28,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  muted: {
    fontSize: 14,
  },
  error: {
    fontSize: 13,
  },
});
