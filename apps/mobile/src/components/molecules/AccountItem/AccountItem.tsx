import { View, Text, StyleSheet } from "react-native";
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import type { Account } from "shared";
import { Amount } from "@/components/atoms/Amount/Amount";
import { ActionPanel } from "@/components/molecules/ActionPanel/ActionPanel";
import { useColors } from "@/hooks";

interface AccountItemProps {
  account: Account;
  isSelected?: boolean;
  onSelect?: () => void;
  onViewMore?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const AccountItem = ({
  account,
  isSelected,
  onSelect,
  onViewMore,
  onEdit,
  onDelete,
}: AccountItemProps) => {
  const colors = useColors();
  const typeColor =
    account.type === "credit" ? colors.accountCredit : colors.accountDebit;

  return (
    <ActionPanel
      withBorderBottom
      onPress={onSelect}
      onViewMore={onViewMore}
      onEdit={onEdit}
      onDelete={onDelete}
    >
      {isSelected && (
        <Svg style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient
              id={`sel-${account._id}`}
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <Stop offset="0" stopColor={colors.neon} stopOpacity="0.18" />
              <Stop offset="1" stopColor={colors.neon} stopOpacity="0" />
            </LinearGradient>
          </Defs>
          <Rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill={`url(#sel-${account._id})`}
          />
        </Svg>
      )}
      <View style={styles.content}>
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.text }]}>
            {account.name}
          </Text>
          <Amount
            value={account.balance}
            currency={account.currency}
            style={[styles.balance, { color: colors.primary }]}
          />
        </View>
        <Text style={[styles.type, { color: typeColor }]}>
          {account.type.toUpperCase()}
        </Text>
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
    gap: 4,
  },
  name: {
    fontSize: 11,
    fontWeight: "400",
  },
  balance: {
    fontSize: 13,
    fontWeight: "600",
  },
  type: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
});
