import { View } from "react-native";
import { CartesianChart, Line, PolarChart, Pie } from "victory-native";
import { useColors } from "@/hooks";
import type { Transaction } from "shared";
import { buildCashflow, round2 } from "@/screens/ChartsScreen/chartBuilders";
import { CHART_HEIGHT, type ChartType } from "@/screens/ChartsScreen/chartTypes";
import EmptyChart from "@/components/atoms/EmptyChart/EmptyChart";
import ChartContainer from "@/components/atoms/ChartContainer/ChartContainer";
import ChartLegend from "@/components/molecules/ChartLegend/ChartLegend";

const CashflowBarChart = ({
  data,
}: {
  data: { x: number; income: number; expenses: number }[];
}) => {
  const colors = useColors();
  const maxVal = Math.max(...data.flatMap((d) => [d.income, d.expenses]), 1);
  return (
    <View
      style={{ height: CHART_HEIGHT, flexDirection: "row", alignItems: "flex-end", gap: 4 }}
    >
      {data.map((item) => (
        <View
          key={item.x}
          style={{ flex: 1, flexDirection: "row", height: "100%", alignItems: "flex-end", gap: 1 }}
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

  const legend = (
    <ChartLegend
      items={[
        { label: "Income", color: colors.success },
        { label: "Expenses", color: colors.danger },
      ]}
    />
  );

  if (chartType === "bar") {
    return (
      <>
        <CashflowBarChart data={data} />
        {legend}
      </>
    );
  }

  if (chartType === "line") {
    return (
      <>
        <ChartContainer>
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
        </ChartContainer>
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
      <ChartContainer>
        <PolarChart
          data={pieData}
          labelKey="label"
          valueKey="value"
          colorKey="color"
        >
          <Pie.Chart innerRadius="50%" />
        </PolarChart>
      </ChartContainer>
      {legend}
    </>
  );
};

export default CashflowChart;
