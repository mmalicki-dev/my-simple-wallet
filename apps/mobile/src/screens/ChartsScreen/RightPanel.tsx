import { HudPanel } from "@/components/templates/HudPanel/HudPanel";
import { ChartType, DATA_LABELS, DataType } from "./chartTypes";
import ChartView from "@/components/organisms/ChartView/ChartView";
import { SkeletonLoader } from "@/components/atoms/SkeletonLoader/SkeletonLoader";
import { Transaction } from "shared";
import { useGetCategoriesQuery } from "@/services";

interface RightPanelProps {
  dataType: DataType;
  isLoading: boolean;
  transactions: Transaction[];
  chartType: ChartType;
}

export const ChartsRightPanel = ({
  dataType,
  isLoading,
  transactions,
  chartType,
}: RightPanelProps) => {
  const { data: categories = [], isLoading: catLoading } =
    useGetCategoriesQuery();
  return (
    <HudPanel label={DATA_LABELS[dataType]}>
      {isLoading || catLoading ? (
        <SkeletonLoader />
      ) : (
        <ChartView
          transactions={transactions}
          categories={categories}
          dataType={dataType}
          chartType={chartType}
        />
      )}
    </HudPanel>
  );
};
