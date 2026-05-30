import type { IconName } from "shared";

export type Period = "month" | "3months" | "6months" | "year" | "custom";
export type DataType = "balance" | "categories" | "cashflow";
export type ChartType = "bar" | "pie" | "line";

export const COMPATIBLE: Record<DataType, ChartType[]> = {
  balance: ["line", "bar"],
  categories: ["pie", "bar"],
  cashflow: ["bar", "line", "pie"],
};

export const PERIODS: { value: Period; label: string }[] = [
  { value: "month", label: "Last month" },
  { value: "3months", label: "Last 3 months" },
  { value: "6months", label: "Last 6 months" },
  { value: "year", label: "Last year" },
  { value: "custom", label: "Custom" },
];

export const DATA_TYPES: { value: DataType; label: string }[] = [
  { value: "balance", label: "Balance" },
  { value: "categories", label: "Categories" },
  { value: "cashflow", label: "Cashflow" },
];

export const CHART_TYPES: { value: ChartType; icon: IconName; label: string }[] = [
  { value: "bar", icon: "chart-bar", label: "Bar" },
  { value: "pie", icon: "chart-pie", label: "Pie" },
  { value: "line", icon: "graph-up", label: "Line" },
];

export const DATA_LABELS: Record<DataType, string> = {
  balance: "My Balance",
  categories: "Spending by Category",
  cashflow: "Cashflow",
};

export const CHART_HEIGHT = 260;
