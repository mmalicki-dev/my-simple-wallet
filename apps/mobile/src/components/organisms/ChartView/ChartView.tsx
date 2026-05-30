import { useMemo } from "react";
import type { Transaction, Category } from "shared";
import { type DataType, type ChartType } from "@/screens/ChartsScreen/chartTypes";
import EmptyChart from "@/components/atoms/EmptyChart/EmptyChart";
import BalanceChart from "@/components/organisms/BalanceChart/BalanceChart";
import CategoriesChart from "@/components/organisms/CategoriesChart/CategoriesChart";
import CashflowChart from "@/components/organisms/CashflowChart/CashflowChart";

interface ChartViewProps {
  transactions: Transaction[];
  categories: Category[];
  dataType: DataType;
  chartType: ChartType;
}

const ChartView = ({
  transactions,
  categories,
  dataType,
  chartType,
}: ChartViewProps) => {
  const catById = useMemo(
    () => new Map(categories.map((c) => [c._id, c])),
    [categories],
  );
  const posted = transactions.filter((t) => t.status === "posted");

  if (posted.length === 0) {
    const message =
      dataType === "categories"
        ? "No expense data for this period"
        : "No transactions for this period";
    return <EmptyChart message={message} />;
  }

  if (dataType === "balance")
    return <BalanceChart posted={posted} chartType={chartType} />;
  if (dataType === "categories")
    return (
      <CategoriesChart posted={posted} chartType={chartType} catById={catById} />
    );
  if (dataType === "cashflow")
    return <CashflowChart posted={posted} chartType={chartType} />;
  return null;
};

export default ChartView;
