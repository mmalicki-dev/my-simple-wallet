import type { IconName, Currency } from "shared";
import type { Account } from "@/types";
import Icon from "@/components/atoms/Icon/Icon";
import ChartOption from "@/components/atoms/ChartOption/ChartOption";
import ChartControlsItem from "@/components/molecules/ChartControlsItem/ChartControlsItem";
import ChartDatePicker from "@/components/molecules/ChartDatePicker/ChartDatePicker";
import styles from "./ChartControls.module.css";

export type Period = "month" | "3months" | "6months" | "year" | "custom";
export type DataType = "balance" | "categories" | "cashflow";
export type ChartType = "bar" | "pie" | "line";

export interface ChartConfig {
  accountIds: string[];
  currency: Currency;
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
  { value: "month", label: "Last month" },
  { value: "3months", label: "Last 3 months" },
  { value: "6months", label: "Last 6 months" },
  { value: "year", label: "Last year" },
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

  const toggleAccount = (id: string) => {
    const ids = config.accountIds.includes(id)
      ? config.accountIds.filter((a) => a !== id)
      : [...config.accountIds, id];
    onChange({ accountIds: ids });
  };

  const availableCurrencies = [
    ...new Set(accounts.map((a) => a.currency)),
  ] as Currency[];

  return (
    <div className={styles.controls}>
      <ChartControlsItem label="Account">
        {accountsLoading ? (
          <div className={styles.placeholder} />
        ) : (
          accounts.map((acc) => (
            <ChartOption
              key={acc._id}
              type="checkbox"
              name="account"
              checked={config.accountIds.includes(acc._id)}
              onChange={() => toggleAccount(acc._id)}
            >
              {acc.name}
            </ChartOption>
          ))
        )}
      </ChartControlsItem>

      {availableCurrencies.length > 1 && (
        <ChartControlsItem label="Currency">
          {availableCurrencies.map((cur) => (
            <ChartOption
              key={cur}
              type="radio"
              name="currency"
              checked={config.currency === cur}
              onChange={() => onChange({ currency: cur })}
            >
              {cur}
            </ChartOption>
          ))}
        </ChartControlsItem>
      )}

      <ChartControlsItem label="Data" role="radiogroup" aria-label="Data">
        {DATA_TYPES.map(({ value, label }) => (
          <ChartOption
            key={value}
            type="radio"
            name="dataType"
            checked={config.dataType === value}
            onChange={() => handleDataTypeChange(value)}
          >
            {label}
          </ChartOption>
        ))}
      </ChartControlsItem>

      <ChartControlsItem
        label="Chart"
        role="radiogroup"
        aria-label="Chart type"
      >
        {CHART_TYPES.map(({ value, icon, label }) => {
          const disabled = !allowedCharts.includes(value);
          return (
            <ChartOption
              key={value}
              type="radio"
              name="chartType"
              checked={config.chartType === value}
              onChange={() => onChange({ chartType: value })}
              disabled={disabled}
            >
              <Icon name={icon} className={styles.icon} />
              {label}
            </ChartOption>
          );
        })}
      </ChartControlsItem>

      <ChartControlsItem label="Period" role="radiogroup" aria-label="Period">
        {PERIODS.map(({ value, label }) => (
          <ChartOption
            key={value}
            type="radio"
            name="period"
            checked={config.period === value}
            onChange={() => onChange({ period: value })}
          >
            {label}
          </ChartOption>
        ))}
      </ChartControlsItem>
      {config.period === "custom" && (
        <ChartDatePicker
          from={config.customFrom}
          to={config.customTo}
          onFromChange={(customFrom) => onChange({ customFrom })}
          onToChange={(customTo) => onChange({ customTo })}
        />
      )}
    </div>
  );
};

export default ChartControls;
