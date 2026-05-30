import { View } from "react-native";
import { PolarChart, Pie } from "victory-native";
import { useColors } from "@/hooks";
import type { Transaction, Category } from "shared";
import {
  buildCategoryPie,
  buildCategoryBar,
} from "@/screens/ChartsScreen/chartBuilders";
import { CHART_HEIGHT, type ChartType } from "@/screens/ChartsScreen/chartTypes";
import EmptyChart from "@/components/atoms/EmptyChart/EmptyChart";
import ChartContainer from "@/components/atoms/ChartContainer/ChartContainer";
import ChartLegend from "@/components/molecules/ChartLegend/ChartLegend";

interface CategoryEntry {
  label: string;
  color: string;
  value: number;
}

const CategoryBarChart = ({ data }: { data: CategoryEntry[] }) => {
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  return (
    <>
      <View
        style={{ height: CHART_HEIGHT, flexDirection: "row", alignItems: "flex-end", gap: 4 }}
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
      <ChartLegend items={data} />
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
        <ChartContainer>
          <PolarChart
            data={data}
            labelKey="label"
            valueKey="value"
            colorKey="color"
          >
            <Pie.Chart innerRadius="50%" />
          </PolarChart>
        </ChartContainer>
        <ChartLegend items={data} />
      </>
    );
  }

  const data = buildCategoryBar(posted, catById, colors.neon);
  if (data.length === 0) return empty;
  return <CategoryBarChart data={data} />;
};

export default CategoriesChart;
