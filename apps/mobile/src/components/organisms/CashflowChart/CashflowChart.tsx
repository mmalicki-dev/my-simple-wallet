import { View, Text, StyleSheet } from "react-native";
import { CartesianChart, Line, PolarChart, Pie } from "victory-native";
import { useColors } from "@/hooks";
import type { Transaction } from "shared";
import {
  buildCashflow,
  round2,
} from "@/screens/ChartsScreen/chartBuilders";
import {
  CHART_HEIGHT,
  type ChartType,
} from "@/screens/ChartsScreen/chartTypes";
import EmptyChart from "@/components/atoms/EmptyChart/EmptyChart";

const CashflowLegend = () => {
  const colors = useColors();
  return (
    <View style={styles.legend}>
      <View style={styles.legendItem}>
        <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
        <Text style={[styles.legendText, { color: colors.textMuted }]}>
          Income
        </Text>
      </View>
      <View style={styles.legendItem}>
        <View style={[styles.legendDot, { backgroundColor: colors.danger }]} />
        <Text style={[styles.legendText, { color: colors.textMuted }]}>
          Expenses
        </Text>
      </View>
    </View>
  );
};

const CashflowBarChart = ({
  data,
  height,
}: {
  data: { x: number; income: number; expenses: number }[];
  height: number;
}) => {
  const colors = useColors();
  const maxVal = Math.max(...data.flatMap((d) => [d.income, d.expenses]), 1);
  return (
    <View
      style={{ height, flexDirection: "row", alignItems: "flex-end", gap: 4 }}
    >
      {data.map((item) => (
        <View
          key={item.x}
          style={{
            flex: 1,
            flexDirection: "row",
            height: "100%",
            alignItems: "flex-end",
            gap: 1,
          }}
        >
          <View style={{ flex: 1, height: "100%", justifyContent: "flex-end" }}>
            <View
              style={{
                height: `${Math.max((item.income / maxVal) * 100, 2)}%`,
                backgroundColor: colors.success,
                borderRadius: 2,
              }}
            />
          </View>
          <View style={{ flex: 1, height: "100%", justifyContent: "flex-end" }}>
            <View
              style={{
                height: `${Math.max((item.expenses / maxVal) * 100, 2)}%`,
                backgroundColor: colors.danger,
                borderRadius: 2,
              }}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

const CashflowChart = ({
  posted,
  chartType,
}: {
  posted: Transaction[];
  chartType: ChartType;
}) => {
  const colors = useColors();
  const data = buildCashflow(posted);
  if (data.length === 0) return <EmptyChart message="Not enough data" />;

  const legend = <CashflowLegend />;

  if (chartType === "bar") {
    return (
      <>
        <CashflowBarChart data={data} height={CHART_HEIGHT} />
        {legend}
      </>
    );
  }

  if (chartType === "line") {
    return (
      <>
        <View style={{ height: CHART_HEIGHT }}>
          <CartesianChart data={data} xKey="x" yKeys={["income", "expenses"]}>
            {({ points }) => (
              <>
                <Line
                  points={points.income}
                  color={colors.success}
                  strokeWidth={2}
                  animate={{ type: "timing", duration: 400 }}
                />
                <Line
                  points={points.expenses}
                  color={colors.danger}
                  strokeWidth={2}
                  animate={{ type: "timing", duration: 400 }}
                />
              </>
            )}
          </CartesianChart>
        </View>
        {legend}
      </>
    );
  }

  const income = data.reduce((s, d) => s + d.income, 0);
  const expenses = data.reduce((s, d) => s + d.expenses, 0);
  const pieData = [
    { label: "Income", value: round2(income), color: colors.success },
    { label: "Expenses", value: round2(expenses), color: colors.danger },
  ];
  return (
    <>
      <View style={{ height: CHART_HEIGHT }}>
        <PolarChart
          data={pieData}
          labelKey="label"
          valueKey="value"
          colorKey="color"
        >
          <Pie.Chart innerRadius="50%" />
        </PolarChart>
      </View>
      {legend}
    </>
  );
};

const styles = StyleSheet.create({
  legend: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "center",
    marginTop: 8,
  },
  legendItem: { flexDirection: "row", gap: 6, alignItems: "center" },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 12 },
});

export default CashflowChart;
