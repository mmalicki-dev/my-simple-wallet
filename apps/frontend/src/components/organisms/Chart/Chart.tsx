import { useMemo, type ReactElement } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import type { Transaction, Category } from "@/types";
import type {
  DataType,
  ChartType,
} from "@/components/organisms/ChartControls/ChartControls";
import { useTheme } from "@/hooks/useTheme";
import styles from "./Chart.module.css";

interface ChartProps {
  transactions: Transaction[];
  categories: Category[];
  dataType: DataType;
  chartType: ChartType;
}

// ============================================================
// Date / number helpers
// ============================================================
const monthKey = (date: string) => date.slice(0, 7);
const formatMonth = (key: string) =>
  new Date(key + "-15").toLocaleDateString("en", {
    month: "short",
    year: "2-digit",
  });
const formatDay = (date: string) =>
  new Date(date).toLocaleDateString("en", {
    month: "short",
    day: "numeric",
  });
const round2 = (n: number) => Math.round(n * 100) / 100;

// ============================================================
// Theme-driven colors
// ============================================================
type Colors = {
  neon: string;
  danger: string;
  success: string;
  border: string;
  muted: string;
};

const useChartColors = (): Colors => {
  const { theme } = useTheme();
  return useMemo(() => {
    const root = getComputedStyle(document.documentElement);
    const read = (v: string) => root.getPropertyValue(v).trim();
    return {
      neon: read("--color-neon"),
      danger: read("--color-danger"),
      success: read("--color-success"),
      border: read("--color-border"),
      muted: read("--color-text-muted"),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);
};

// ============================================================
// Data builders
// ============================================================
const balanceLineData = (transactions: Transaction[]) => {
  const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date));
  let balance = 0;
  return sorted.map((t) => {
    balance += t.type === "income" ? t.amount : -t.amount;
    return { date: formatDay(t.date), balance: round2(balance) };
  });
};

const balanceBarData = (transactions: Transaction[]) => {
  const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date));
  const map = new Map<string, number>();
  let balance = 0;
  for (const t of sorted) {
    balance += t.type === "income" ? t.amount : -t.amount;
    map.set(monthKey(t.date), balance);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, v]) => ({ month: formatMonth(key), balance: round2(v) }));
};

const categoryData = (
  transactions: Transaction[],
  categoryById: Map<string, Category>,
  fallbackColor: string,
) => {
  const totals = new Map<string, number>();
  for (const t of transactions) {
    if (t.type !== "expense") continue;
    totals.set(t.category, (totals.get(t.category) ?? 0) + t.amount);
  }
  return [...totals.entries()]
    .map(([id, value]) => {
      const cat = categoryById.get(id);
      return {
        name: cat?.name ?? "Uncategorized",
        value: round2(value),
        fill: cat?.colour ?? fallbackColor,
      };
    })
    .sort((a, b) => b.value - a.value);
};

const cashflowMonthly = (transactions: Transaction[]) => {
  const map = new Map<string, { income: number; expenses: number }>();
  for (const t of transactions) {
    const key = monthKey(t.date);
    if (!map.has(key)) map.set(key, { income: 0, expenses: 0 });
    const entry = map.get(key)!;
    if (t.type === "income") entry.income += t.amount;
    else entry.expenses += t.amount;
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, data]) => ({
      month: formatMonth(key),
      income: round2(data.income),
      expenses: round2(data.expenses),
    }));
};

const cashflowTotals = (transactions: Transaction[], colors: Colors) => {
  let income = 0;
  let expenses = 0;
  for (const t of transactions) {
    if (t.type === "income") income += t.amount;
    else expenses += t.amount;
  }
  return [
    {
      name: "Income",
      value: round2(income),
      fill: colors.success || colors.neon,
    },
    { name: "Expenses", value: round2(expenses), fill: colors.danger },
  ];
};

// ============================================================
// Render
// ============================================================
const axisProps = (colors: Colors) => ({
  stroke: colors.border,
  tick: { fontSize: 11, fill: colors.muted },
});

const renderChart = (
  transactions: Transaction[],
  categoryById: Map<string, Category>,
  dataType: DataType,
  chartType: ChartType,
  colors: Colors,
): ReactElement | null => {
  const margin = { top: 4, right: 4, left: -16, bottom: 0 };
  const key: `${DataType}:${ChartType}` = `${dataType}:${chartType}`;

  switch (key) {
    case "balance:line":
      return (
        <LineChart data={balanceLineData(transactions)} margin={margin}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
          <XAxis dataKey="date" {...axisProps(colors)} />
          <YAxis {...axisProps(colors)} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="balance"
            name="Balance"
            stroke={colors.neon}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      );

    case "balance:bar":
      return (
        <BarChart data={balanceBarData(transactions)} margin={margin}>
          <XAxis dataKey="month" {...axisProps(colors)} />
          <YAxis {...axisProps(colors)} />
          <Tooltip />
          <Bar
            dataKey="balance"
            name="Balance"
            fill={colors.neon}
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      );

    case "categories:pie":
      return (
        <PieChart>
          <Pie
            data={categoryData(transactions, categoryById, colors.neon)}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="45%"
            outerRadius={90}
            innerRadius={50}
            paddingAngle={2}
            stroke={colors.border}
          />
          <Tooltip />
          <Legend />
        </PieChart>
      );

    case "categories:bar":
      return (
        <BarChart
          data={categoryData(transactions, categoryById, colors.neon)}
          margin={margin}
        >
          <XAxis dataKey="name" {...axisProps(colors)} />
          <YAxis {...axisProps(colors)} />
          <Tooltip />
          <Bar dataKey="value" name="Spent" radius={[2, 2, 0, 0]} />
        </BarChart>
      );

    case "cashflow:bar":
      return (
        <BarChart data={cashflowMonthly(transactions)} margin={margin}>
          <XAxis dataKey="month" {...axisProps(colors)} />
          <YAxis {...axisProps(colors)} />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="income"
            name="Income"
            fill={colors.success || colors.neon}
            radius={[2, 2, 0, 0]}
          />
          <Bar
            dataKey="expenses"
            name="Expenses"
            fill={colors.danger}
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      );

    case "cashflow:line":
      return (
        <LineChart data={cashflowMonthly(transactions)} margin={margin}>
          <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
          <XAxis dataKey="month" {...axisProps(colors)} />
          <YAxis {...axisProps(colors)} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="income"
            name="Income"
            stroke={colors.success || colors.neon}
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="expenses"
            name="Expenses"
            stroke={colors.danger}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      );

    case "cashflow:pie":
      return (
        <PieChart>
          <Pie
            data={cashflowTotals(transactions, colors)}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="45%"
            outerRadius={90}
            innerRadius={50}
            paddingAngle={2}
            stroke={colors.border}
          />
          <Tooltip />
          <Legend />
        </PieChart>
      );

    default:
      return null;
  }
};

const Chart = ({
  transactions,
  categories,
  dataType,
  chartType,
}: ChartProps) => {
  const colors = useChartColors();
  const categoryById = useMemo(
    () => new Map(categories.map((c) => [c._id, c])),
    [categories],
  );

  if (!colors.neon) return null;

  const chart = renderChart(
    transactions,
    categoryById,
    dataType,
    chartType,
    colors,
  );

  if (!chart) {
    return (
      <span className={styles.empty}>
        This chart isn't available for the selected data.
      </span>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      {chart}
    </ResponsiveContainer>
  );
};

export default Chart;
