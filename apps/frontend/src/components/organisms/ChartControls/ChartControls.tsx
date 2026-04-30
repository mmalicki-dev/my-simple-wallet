import type { IconName } from "shared";
import type { Account } from "@/types";
import Icon from "@/components/atoms/Icon/Icon";
import ChartButton from "@/components/atoms/ChartButton/ChartButton";
import ChartControlsItem from "@/components/molecules/ChartControlsItem/ChartControlsItem";
import ChartDatePicker from "@/components/molecules/ChartDatePicker/ChartDatePicker";
import styles from "./ChartControls.module.css";

export type Period = "month" | "3months" | "6months" | "year" | "custom";
export type DataType = "balance" | "categories" | "cashflow";
export type ChartType = "bar" | "pie" | "line";

export interface ChartConfig {
  accountId: string | null;
  period: Period;
  customFrom: string;
  customTo: string;
  dataType: DataType;
  chartType: ChartType;
}

interface ChartControlsProps {
  config: ChartConfig;
  onChange: (next: Partial<ChartConfig>) => void;
  accounts: Account[];
  accountsLoading: boolean;
}

const PERIODS: { value: Period; label: string }[] = [
  { value: "month", label: "Month" },
  { value: "3months", label: "3M" },
  { value: "6months", label: "6M" },
  { value: "year", label: "Year" },
  { value: "custom", label: "Custom" },
];

const DATA_TYPES: { value: DataType; label: string }[] = [
  { value: "balance", label: "Balance" },
  { value: "categories", label: "Categories" },
  { value: "cashflow", label: "Cashflow" },
];

const CHART_TYPES: { value: ChartType; icon: IconName; label: string }[] = [
  { value: "bar", icon: "chart-bar", label: "Bar" },
  { value: "pie", icon: "chart-pie", label: "Pie" },
  { value: "line", icon: "graph-up", label: "Line" },
];

export const COMPATIBLE_CHARTS: Record<DataType, ChartType[]> = {
  balance: ["line", "bar"],
  categories: ["pie", "bar"],
  cashflow: ["bar", "line", "pie"],
};

const ChartControls = ({
  config,
  onChange,
  accounts,
  accountsLoading,
}: ChartControlsProps) => {
  const allowedCharts = COMPATIBLE_CHARTS[config.dataType];

  const handleDataTypeChange = (dataType: DataType) => {
    const allowed = COMPATIBLE_CHARTS[dataType];
    const chartType = allowed.includes(config.chartType)
      ? config.chartType
      : allowed[0];
    onChange({ dataType, chartType });
  };

  return (
    <div className={styles.controls}>
      <ChartControlsItem label="Account">
        {accountsLoading ? (
          <div className={styles.placeholder} />
        ) : accounts.map((acc) => (
          <ChartButton
            key={acc._id}
            active={acc._id === config.accountId}
            onClick={() => onChange({ accountId: acc._id })}
          >
            {acc.name}
          </ChartButton>
        ))}
      </ChartControlsItem>

      <ChartControlsItem
        label="Period"
        role="radiogroup"
        aria-label="Period"
        footer={config.period === "custom" && (
          <ChartDatePicker
            from={config.customFrom}
            to={config.customTo}
            onFromChange={(customFrom) => onChange({ customFrom })}
            onToChange={(customTo) => onChange({ customTo })}
          />
        )}
      >
        {PERIODS.map(({ value, label }) => (
          <ChartButton
            key={value}
            active={config.period === value}
            onClick={() => onChange({ period: value })}
          >
            {label}
          </ChartButton>
        ))}
      </ChartControlsItem>

      <ChartControlsItem label="Data" role="radiogroup" aria-label="Data">
        {DATA_TYPES.map(({ value, label }) => (
          <ChartButton
            key={value}
            active={config.dataType === value}
            onClick={() => handleDataTypeChange(value)}
          >
            {label}
          </ChartButton>
        ))}
      </ChartControlsItem>

      <ChartControlsItem label="Chart" role="radiogroup" aria-label="Chart type">
        {CHART_TYPES.map(({ value, icon, label }) => {
          const disabled = !allowedCharts.includes(value);
          return (
            <ChartButton
              key={value}
              active={config.chartType === value}
              disabled={disabled}
              ariaLabel={label}
              title={disabled ? `${label} not available for this data` : label}
              onClick={() => onChange({ chartType: value })}
            >
              <Icon name={icon} className={styles.icon} />
            </ChartButton>
          );
        })}
      </ChartControlsItem>
    </div>
  );
};

export default ChartControls;
