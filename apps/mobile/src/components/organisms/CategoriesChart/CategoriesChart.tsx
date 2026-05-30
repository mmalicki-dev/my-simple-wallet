import { View, Text, StyleSheet } from "react-native";
import { PolarChart, Pie } from "victory-native";
import { useColors } from "@/hooks";
import type { Transaction, Category } from "shared";
import {
  buildCategoryPie,
  buildCategoryBar,
} from "@/screens/ChartsScreen/chartBuilders";
import {
  CHART_HEIGHT,
  type ChartType,
} from "@/screens/ChartsScreen/chartTypes";
import EmptyChart from "@/components/atoms/EmptyChart/EmptyChart";

interface LegendItem {
  label: string;
  color: string;
}

interface CategoryEntry extends LegendItem {
  value: number;
}

const CategoryLegend = ({ items }: { items: LegendItem[] }) => {
  const colors = useColors();
  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <View key={item.label} style={styles.item}>
          <View style={[styles.dot, { backgroundColor: item.color }]} />
          <Text
            style={[styles.label, { color: colors.textMuted }]}
            numberOfLines={1}
          >
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
};

const CategoryBarChart = ({
  data,
  height,
}: {
  data: CategoryEntry[];
  height: number;
}) => {
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  return (
    <>
      <View
        style={{ height, flexDirection: "row", alignItems: "flex-end", gap: 4 }}
      >
        {data.map((item) => (
          <View
            key={item.label}
            style={{ flex: 1, height: "100%", justifyContent: "flex-end" }}
          >
            <View
              style={{
                height: `${Math.max((item.value / maxVal) * 100, 2)}%`,
                backgroundColor: item.color,
                borderRadius: 3,
              }}
            />
          </View>
        ))}
      </View>
      <CategoryLegend items={data} />
    </>
  );
};

const CategoriesChart = ({
  posted,
  chartType,
  catById,
}: {
  posted: Transaction[];
  chartType: ChartType;
  catById: Map<string, Category>;
}) => {
  const colors = useColors();
  const empty = <EmptyChart message="No expense data for this period" />;

  if (chartType === "pie") {
    const data = buildCategoryPie(posted, catById, colors.neon);
    if (data.length === 0) return empty;
    return (
      <>
        <View style={{ height: CHART_HEIGHT }}>
          <PolarChart
            data={data}
            labelKey="label"
            valueKey="value"
            colorKey="color"
          >
            <Pie.Chart innerRadius="50%" />
          </PolarChart>
        </View>
        <CategoryLegend items={data} />
      </>
    );
  }

  const data = buildCategoryBar(posted, catById, colors.neon);
  if (data.length === 0) return empty;
  return <CategoryBarChart data={data} height={CHART_HEIGHT} />;
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12,
    justifyContent: "center",
  },
  item: { flexDirection: "row", alignItems: "center", gap: 5 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  label: { fontSize: 11 },
});

export default CategoriesChart;
