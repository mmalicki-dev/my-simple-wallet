import { View, Text, StyleSheet } from "react-native";
import { useColors } from "@/hooks";
import { ActionPanel } from "@/components/molecules/ActionPanel/ActionPanel";

interface UserSectionItemProps {
  label: string;
  subtitle?: string;
  indicator?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const UserSectionItem = ({
  label,
  subtitle,
  indicator,
  onEdit,
  onDelete,
}: UserSectionItemProps) => {
  const colors = useColors();
  return (
    <ActionPanel withBorderBottom onEdit={onEdit} onDelete={onDelete}>
      <View style={styles.item}>
        {indicator && (
          <View style={[styles.indicator, { backgroundColor: indicator }]} />
        )}
        <View style={styles.content}>
          <Text style={[styles.label, { color: colors.text }]} numberOfLines={1}>
            {label}
          </Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: colors.textMuted }]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
    </ActionPanel>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  indicator: {
    width: 9,
    height: 9,
    flexShrink: 0,
  },
  content: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
  },
  subtitle: {
    fontSize: 12,
    letterSpacing: 0.5,
  },
});

export default UserSectionItem;
