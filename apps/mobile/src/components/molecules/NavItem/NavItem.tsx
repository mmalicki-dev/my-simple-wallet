import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Icon } from "@/components/atoms/Icon/Icon";
import { useColors } from "@/hooks";
import type { IconName } from "shared";

interface NavItemProps {
  icon: IconName;
  label: string;
  active: boolean;
  onPress: () => void;
}

export const NavItem = ({ icon, label, active, onPress }: NavItemProps) => {
  const colors = useColors();
  return (
    <TouchableOpacity style={styles.item} onPress={onPress} activeOpacity={0.7}>
      <Icon name={icon} size={22} color={active ? colors.neon : colors.textMuted} />
      <Text style={[styles.label, { color: active ? colors.neon : colors.textMuted }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 6,
    gap: 3,
  },
  label: {
    fontSize: 10,
    fontWeight: "500",
  },
});
