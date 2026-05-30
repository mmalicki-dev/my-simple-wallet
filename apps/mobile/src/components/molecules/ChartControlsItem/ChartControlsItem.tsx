import { View, Text, StyleSheet } from "react-native";
import { useColors } from "@/hooks";

interface ChartControlsItemProps {
  label: string;
  children: React.ReactNode;
}

const ChartControlsItem = ({ label, children }: ChartControlsItemProps) => {
  const colors = useColors();
  return (
    <View style={styles.controlsItem}>
      <Text style={[styles.controlsItemLabel, { color: colors.textMuted }]}>
        {label}
      </Text>
      <View style={styles.controlsItemOptions}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  controlsItem: { gap: 6 },
  controlsItemLabel: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  controlsItemOptions: { gap: 2 },
});

export default ChartControlsItem;
