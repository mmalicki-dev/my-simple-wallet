import { View, Text, StyleSheet } from "react-native";
import { useColors } from "@/hooks";
import { Icon } from "@/components/atoms/Icon/Icon";
import { SkeletonLoader } from "@/components/atoms/SkeletonLoader/SkeletonLoader";
import ChartOption from "@/components/atoms/ChartOption/ChartOption";
import ChartControlsItem from "@/components/molecules/ChartControlsItem/ChartControlsItem";
import DatePickerField from "@/components/molecules/DatePickerField/DatePickerField";
import type { Account, Currency } from "shared";
import {
  PERIODS,
  DATA_TYPES,
  CHART_TYPES,
  COMPATIBLE,
  type Period,
  type DataType,
  type ChartType,
} from "@/screens/ChartsScreen/chartTypes";
import { todayIso } from "@/screens/ChartsScreen/chartBuilders";

interface ChartControlsProps {
  accounts: Account[];
  accountsLoading: boolean;
  selectedAccountIds: string[];
  toggleAccount: (id: string) => void;
  availableCurrencies: Currency[];
  currency: Currency | null;
  setCurrency: (cur: Currency) => void;
  dataType: DataType;
  onDataTypeChange: (type: DataType) => void;
  chartType: ChartType;
  setChartType: (type: ChartType) => void;
  period: Period;
  setPeriod: (p: Period) => void;
  customFrom: string;
  setCustomFrom: (d: string) => void;
  customTo: string;
  setCustomTo: (d: string) => void;
}

const ChartControls = ({
  accounts,
  accountsLoading,
  selectedAccountIds,
  toggleAccount,
  availableCurrencies,
  currency,
  setCurrency,
  dataType,
  onDataTypeChange,
  chartType,
  setChartType,
  period,
  setPeriod,
  customFrom,
  setCustomFrom,
  customTo,
  setCustomTo,
}: ChartControlsProps) => {
  const colors = useColors();
  const allowedCharts = COMPATIBLE[dataType];

  return (
    <View style={styles.controls}>
      <ChartControlsItem label="Account">
        {accountsLoading ? (
          <SkeletonLoader />
        ) : (
          accounts.map((acc) => (
            <ChartOption
              key={acc._id}
              checked={selectedAccountIds.includes(acc._id)}
              onPress={() => toggleAccount(acc._id)}
            >
              <Text
                style={[
                  styles.optionText,
                  {
                    color: selectedAccountIds.includes(acc._id)
                      ? colors.neon
                      : colors.textMuted,
                  },
                ]}
              >
                {acc.name}
              </Text>
            </ChartOption>
          ))
        )}
      </ChartControlsItem>

      {availableCurrencies.length > 1 && (
        <ChartControlsItem label="Currency">
          {availableCurrencies.map((cur) => (
            <ChartOption
              key={cur}
              checked={currency === cur}
              onPress={() => setCurrency(cur)}
            >
              <Text
                style={[
                  styles.optionText,
                  {
                    color: currency === cur ? colors.neon : colors.textMuted,
                  },
                ]}
              >
                {cur}
              </Text>
            </ChartOption>
          ))}
        </ChartControlsItem>
      )}

      <ChartControlsItem label="Data">
        {DATA_TYPES.map(({ value, label }) => (
          <ChartOption
            key={value}
            checked={dataType === value}
            onPress={() => onDataTypeChange(value)}
          >
            <Text
              style={[
                styles.optionText,
                { color: dataType === value ? colors.neon : colors.textMuted },
              ]}
            >
              {label}
            </Text>
          </ChartOption>
        ))}
      </ChartControlsItem>

      <ChartControlsItem label="Chart">
        {CHART_TYPES.map(({ value, icon, label }) => {
          const disabled = !allowedCharts.includes(value);
          return (
            <ChartOption
              key={value}
              checked={chartType === value}
              onPress={() => setChartType(value)}
              disabled={disabled}
            >
              <Icon
                name={icon}
                size={16}
                color={
                  disabled
                    ? colors.textMuted
                    : chartType === value
                      ? colors.neon
                      : colors.textMuted
                }
              />
              <Text
                style={[
                  styles.optionText,
                  {
                    color:
                      chartType === value ? colors.neon : colors.textMuted,
                  },
                ]}
              >
                {label}
              </Text>
            </ChartOption>
          );
        })}
      </ChartControlsItem>

      <ChartControlsItem label="Period">
        {PERIODS.map(({ value, label }) => (
          <ChartOption
            key={value}
            checked={period === value}
            onPress={() => setPeriod(value)}
          >
            <Text
              style={[
                styles.optionText,
                { color: period === value ? colors.neon : colors.textMuted },
              ]}
            >
              {label}
            </Text>
          </ChartOption>
        ))}
      </ChartControlsItem>

      {period === "custom" && (
        <View style={styles.dateRow}>
          <DatePickerField
            label="From"
            value={customFrom}
            max={customTo}
            onChange={setCustomFrom}
          />
          <DatePickerField
            label="To"
            value={customTo}
            min={customFrom}
            max={todayIso()}
            onChange={setCustomTo}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  controls: { gap: 20 },
  optionText: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  dateRow: { flexDirection: "row", gap: 16 },
});

export default ChartControls;
