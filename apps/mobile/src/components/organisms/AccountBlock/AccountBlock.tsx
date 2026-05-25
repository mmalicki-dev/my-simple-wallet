import { View, Text, Pressable, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useGetAccountsQuery } from "@/services";
import { AccountItem } from "@/components/molecules/AccountItem/AccountItem";
import { Icon } from "@/components/atoms/Icon/Icon";
import { useColors } from "@/hooks";
import type { RootStackParamList } from "@/navigation";

type NavProp = NativeStackNavigationProp<RootStackParamList>;

interface AccountBlockProps {
  selectedAccountId?: string;
  onSelectAccount?: (id: string) => void;
}

export const AccountBlock = ({
  selectedAccountId,
  onSelectAccount,
}: AccountBlockProps) => {
  const colors = useColors();
  const navigation = useNavigation<NavProp>();
  const { data: accounts = [], isLoading } = useGetAccountsQuery();

  if (isLoading) return null;

  if (accounts.length === 0) {
    return (
      <View style={styles.empty}>
        <Icon name="wallet" size={32} color={colors.textMuted} />
        <Text style={[styles.emptyText, { color: colors.textMuted }]}>
          No accounts yet
        </Text>
        <Pressable onPress={() => navigation.navigate("Accounts")}>
          <Text style={[styles.emptyLink, { color: colors.neon }]}>
            Go to settings to add your first account
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      {accounts.map((account) => (
        <AccountItem
          key={account._id}
          account={account}
          isSelected={selectedAccountId === account._id}
          onSelect={() => onSelectAccount?.(account._id)}
          onViewMore={() => navigation.navigate("Accounts")}
          onEdit={() => navigation.navigate("Accounts")}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    gap: 2,
  },
  empty: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
  },
  emptyText: {
    fontSize: 13,
  },
  emptyLink: {
    fontSize: 12,
    textDecorationLine: "underline",
  },
});
