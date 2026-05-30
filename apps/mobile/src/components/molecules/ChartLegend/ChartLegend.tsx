import { View, Text, StyleSheet } from "react-native";
import { useColors } from "@/hooks";

interface LegendItem {
  label: string;
  color: string;
}

const ChartLegend = ({ items }: { items: LegendItem[] }) => {
  const colors = useColors();
  return (
    <View style={styles.legend}>
      {items.map((item) => (
        <View key={item.label} style={styles.item}>
          <View style={[styles.dot, { backgroundColor: item.color }]} />
          <Text style={[styles.label, { color: colors.textMuted }]} numberOfLines={1}>
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 8,
    justifyContent: "center",
  },
  item: { flexDirection: "row", alignItems: "center", gap: 5 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  label: { fontSize: 11 },
});

export default ChartLegend;
