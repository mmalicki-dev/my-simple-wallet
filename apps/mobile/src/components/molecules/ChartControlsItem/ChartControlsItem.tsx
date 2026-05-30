import { View, Text, StyleSheet } from "react-native";
import { useColors } from "@/hooks";
import { sectionLabel } from "@/styles/typography";

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
  controlsItemLabel: sectionLabel,
  controlsItemOptions: { gap: 2 },
});

export default ChartControlsItem;
