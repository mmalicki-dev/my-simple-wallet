import type { IconName } from "shared";
import type { Account } from "@/types";
import Icon from "@/components/atoms/Icon/Icon";
import ChartButton from "@/components/atoms/ChartButton/ChartButton";
import ChartControlsItem from "@/components/molecules/ChartControlsItem/ChartControlsItem";
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

const todayIso = () => new Date().toISOString().slice(0, 10);

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
        ) : (
          <div className={styles.chips} role="radiogroup" aria-label="Account">
            {accounts.map((acc) => (
              <ChartButton
                key={acc._id}
                active={acc._id === config.accountId}
                onClick={() => onChange({ accountId: acc._id })}
              >
                {acc.name}
              </ChartButton>
            ))}
          </div>
        )}
      </ChartControlsItem>

      <ChartControlsItem label="Period">
        <div className={styles.segment} role="radiogroup" aria-label="Period">
          {PERIODS.map(({ value, label }) => (
            <ChartButton
              key={value}
              active={config.period === value}
              onClick={() => onChange({ period: value })}
            >
              {label}
            </ChartButton>
          ))}
        </div>
        {config.period === "custom" && (
          <div className={styles.dateRange}>
            <label className={styles.dateField}>
              <span className={styles.dateLabel}>From</span>
              <input
                type="date"
                value={config.customFrom}
                max={config.customTo}
                onChange={(e) => onChange({ customFrom: e.target.value })}
                className={styles.dateInput}
              />
            </label>
            <label className={styles.dateField}>
              <span className={styles.dateLabel}>To</span>
              <input
                type="date"
                value={config.customTo}
                min={config.customFrom}
                max={todayIso()}
                onChange={(e) => onChange({ customTo: e.target.value })}
                className={styles.dateInput}
              />
            </label>
          </div>
        )}
      </ChartControlsItem>

      <ChartControlsItem label="Data">
        <div className={styles.segment} role="radiogroup" aria-label="Data">
          {DATA_TYPES.map(({ value, label }) => (
            <ChartButton
              key={value}
              active={config.dataType === value}
              onClick={() => handleDataTypeChange(value)}
            >
              {label}
            </ChartButton>
          ))}
        </div>
      </ChartControlsItem>

      <ChartControlsItem label="Chart">
        <div
          className={styles.iconSegment}
          role="radiogroup"
          aria-label="Chart type"
        >
          {CHART_TYPES.map(({ value, icon, label }) => {
            const disabled = !allowedCharts.includes(value);
            return (
              <ChartButton
                key={value}
                active={config.chartType === value}
                disabled={disabled}
                ariaLabel={label}
                title={
                  disabled ? `${label} not available for this data` : label
                }
                onClick={() => onChange({ chartType: value })}
              >
                <Icon name={icon} className={styles.icon} />
              </ChartButton>
            );
          })}
        </div>
      </ChartControlsItem>
    </div>
  );
};

export default ChartControls;
