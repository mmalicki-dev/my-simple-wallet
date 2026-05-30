import { Platform } from "react-native";
import { CartesianChart, Line, Bar } from "victory-native";
import { matchFont } from "@shopify/react-native-skia";
import { useColors } from "@/hooks";
import type { Transaction } from "shared";
import {
  buildBalanceLine,
  buildBalanceBar,
  fmtMoney,
} from "@/screens/ChartsScreen/chartBuilders";
import { type ChartType } from "@/screens/ChartsScreen/chartTypes";
import EmptyChart from "@/components/atoms/EmptyChart/EmptyChart";
import ChartContainer from "@/components/atoms/ChartContainer/ChartContainer";

const axisFont = matchFont({
  fontFamily: Platform.select({ ios: "Helvetica", default: "sans-serif" }),
  fontSize: 10,
});

const BalanceChart = ({
  posted,
  chartType,
}: {
  posted: Transaction[];
  chartType: ChartType;
}) => {
  const colors = useColors();

  const axisOptions = {
    font: axisFont,
    formatYLabel: fmtMoney,
    labelColor: colors.textMuted,
    lineColor: colors.border,
  };

  if (chartType === "line") {
    const data = buildBalanceLine(posted);
    if (data.length < 2) return <EmptyChart message="Not enough data" />;
    const dates = data.map((d) => d.date);
    return (
      <ChartContainer>
        <CartesianChart
          data={data}
          xKey="x"
          yKeys={["balance"]}
          axisOptions={{
            ...axisOptions,
            formatXLabel: (val) => {
              const raw = dates[Math.round(Number(val))];
              if (!raw) return "";
              const d = new Date(raw);
              return `${d.getDate()}/${d.getMonth() + 1}`;
            },
          }}
        >
          {({ points }) => (
            <Line
              points={points.balance}
              color={colors.neon}
              strokeWidth={2}
              animate={{ type: "timing", duration: 400 }}
            />
          )}
        </CartesianChart>
      </ChartContainer>
    );
  }

  const data = buildBalanceBar(posted);
  if (data.length === 0) return <EmptyChart message="Not enough data" />;
  const months = data.map((d) => d.month);
  return (
    <ChartContainer>
      <CartesianChart
        data={data}
        xKey="x"
        yKeys={["balance"]}
        axisOptions={{
          ...axisOptions,
          formatXLabel: (val) => {
            const m = months[Math.round(Number(val))];
            if (!m) return "";
            return new Date(`${m}-02`).toLocaleDateString("en", {
              month: "short",
            });
          },
        }}
      >
        {({ points, chartBounds }) => (
          <Bar
            points={points.balance}
            chartBounds={chartBounds}
            color={colors.neon}
            roundedCorners={{ topLeft: 3, topRight: 3 }}
            animate={{ type: "timing", duration: 400 }}
          />
        )}
      </CartesianChart>
    </ChartContainer>
  );
};

export default BalanceChart;
