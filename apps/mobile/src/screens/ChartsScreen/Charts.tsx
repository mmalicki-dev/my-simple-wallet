import { useState, useMemo, useEffect } from "react";
import { ScreenLayout } from "@/components/templates/ScreenLayout/ScreenLayout";
import { HudPanel } from "@/components/templates/HudPanel/HudPanel";
import { SkeletonLoader } from "@/components/atoms/SkeletonLoader/SkeletonLoader";
import ChartControls from "@/components/organisms/ChartControls/ChartControls";
import ChartView from "@/components/organisms/ChartView/ChartView";
import {
  useGetTransactionsQuery,
  useGetCategoriesQuery,
  useGetAccountsQuery,
} from "@/services";
import type { Currency } from "shared";
import { getRange, isoDate, todayIso } from "./chartBuilders";
import {
  COMPATIBLE,
  DATA_LABELS,
  type Period,
  type DataType,
  type ChartType,
} from "./chartTypes";
import { ChartsRightPanel } from "./RightPanel";

const ChartsScreen = () => {
  const [period, setPeriod] = useState<Period>("month");
  const [customFrom, setCustomFrom] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return isoDate(d);
  });
  const [customTo, setCustomTo] = useState(todayIso);
  const [dataType, setDataType] = useState<DataType>("balance");
  const [chartType, setChartType] = useState<ChartType>("line");
  const [selectedAccountIds, setSelectedAccountIds] = useState<string[]>([]);
  const [currency, setCurrency] = useState<Currency | null>(null);

  const { data: accounts = [], isLoading: accountsLoading } =
    useGetAccountsQuery();

  useEffect(() => {
    if (selectedAccountIds.length > 0 || accounts.length === 0) return;
    const def = accounts.find((a) => a.isDefault) ?? accounts[0];
    setSelectedAccountIds([def._id]);
    setCurrency(def.currency);
  }, [accounts, selectedAccountIds.length]);

  const { from, to } = getRange(period, customFrom, customTo);
  const { data: txData, isLoading: txLoading } = useGetTransactionsQuery(
    { from, to },
    { skip: selectedAccountIds.length === 0 },
  );
  const { data: categories = [], isLoading: catLoading } =
    useGetCategoriesQuery();

  const allTransactions = txData?.transactions ?? [];
  const isLoading = txLoading || catLoading || accountsLoading;

  const availableCurrencies = useMemo(
    () => [...new Set(accounts.map((a) => a.currency))] as Currency[],
    [accounts],
  );

  const filteredTransactions = allTransactions.filter((t) =>
    selectedAccountIds.includes(t.account),
  );

  const handleDataTypeChange = (type: DataType) => {
    const allowed = COMPATIBLE[type];
    setDataType(type);
    if (!allowed.includes(chartType)) setChartType(allowed[0]);
  };

  const toggleAccount = (id: string) => {
    setSelectedAccountIds((prev) => {
      if (prev.includes(id) && prev.length === 1) return prev;
      return prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id];
    });
  };

  return (
    <ScreenLayout
      sidebar={
        <ChartsRightPanel
          dataType={dataType}
          isLoading={isLoading}
          transactions={filteredTransactions}
          chartType={chartType}
        />
      }
    >
      <HudPanel label="Controls">
        <ChartControls
          accounts={accounts}
          accountsLoading={accountsLoading}
          selectedAccountIds={selectedAccountIds}
          toggleAccount={toggleAccount}
          availableCurrencies={availableCurrencies}
          currency={currency}
          setCurrency={setCurrency}
          dataType={dataType}
          onDataTypeChange={handleDataTypeChange}
          chartType={chartType}
          setChartType={setChartType}
          period={period}
          setPeriod={setPeriod}
          customFrom={customFrom}
          setCustomFrom={setCustomFrom}
          customTo={customTo}
          setCustomTo={setCustomTo}
        />
      </HudPanel>
    </ScreenLayout>
  );
};

export default ChartsScreen;
