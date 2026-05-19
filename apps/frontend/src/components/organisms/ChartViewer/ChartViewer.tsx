import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useGetAccountsQuery } from "@/services/accountApi";
import { useGetTransactionsQuery } from "@/services/transactionApi";
import { useGetCategoriesQuery } from "@/services/categoryApi";
import Spinner from "@/components/atoms/Spinner/Spinner";
import HudPanel from "@/components/templates/HudPanel/HudPanel";
import PanelLabel from "@/components/atoms/PanelLabel/PanelLabel";
import Chart from "@/components/organisms/Chart/Chart";
import ChartControls, {
  type ChartConfig,
  type DataType,
  type Period,
} from "@/components/organisms/ChartControls/ChartControls";
import styles from "./ChartViewer.module.css";

const DATA_LABELS: Record<DataType, string> = {
  balance: "My Balance",
  categories: "Spending by Category",
  cashflow: "My Cashflow",
};

// ============================================================
// Date helpers
// ============================================================
const isoDate = (d: Date) => d.toISOString().slice(0, 10);
const todayIso = () => isoDate(new Date());
const monthAgoIso = () => {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  return isoDate(d);
};

const getPresetRange = (
  period: Exclude<Period, "custom">,
): { from: string; to: string } => {
  const today = new Date();
  const to = isoDate(today);
  let from: Date;
  switch (period) {
    case "month":
      from = new Date(today.getFullYear(), today.getMonth(), 1);
      break;
    case "3months":
      from = new Date(today.getFullYear(), today.getMonth() - 3, 1);
      break;
    case "6months":
      from = new Date(today.getFullYear(), today.getMonth() - 6, 1);
      break;
    case "year":
      from = new Date(today.getFullYear(), 0, 1);
      break;
  }
  return { from: isoDate(from), to };
};

// ============================================================
// Component
// ============================================================
const ChartViewer = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  const [config, setConfig] = useState<ChartConfig>({
    accountIds: [],
    currency: user?.totalBalanceCurrency ?? "EUR",
    period: "month",
    customFrom: monthAgoIso(),
    customTo: todayIso(),
    dataType: "balance",
    chartType: "line",
  });

  const updateConfig = (next: Partial<ChartConfig>) =>
    setConfig((c) => ({ ...c, ...next }));

  const { data: accounts = [], isLoading: accountsLoading } =
    useGetAccountsQuery();

  useEffect(() => {
    if (config.accountIds.length > 0 || accounts.length === 0) return;
    const defaultAccount = accounts.find((a) => a.isDefault) ?? accounts[0];
    setConfig((c) => ({
      ...c,
      accountIds: [defaultAccount._id],
      currency: c.currency === "EUR" && !user?.totalBalanceCurrency
        ? defaultAccount.currency
        : c.currency,
    }));
  }, [accounts, config.accountIds.length, user?.totalBalanceCurrency]);

  const { from, to } =
    config.period === "custom"
      ? { from: config.customFrom, to: config.customTo }
      : getPresetRange(config.period);

  const { data: txData, isLoading: txLoading } = useGetTransactionsQuery(
    { from, to },
    { skip: config.accountIds.length === 0 },
  );

  const transactions =
    txData?.transactions.filter(
      (t) => t.status === "posted" && config.accountIds.includes(t.account),
    ) ?? [];

  const { data: categories = [], isLoading: categoriesLoading } =
    useGetCategoriesQuery();

  const isLoading = accountsLoading || txLoading || categoriesLoading;

  return (
    <div className={styles.viewer}>
      <ChartControls
        config={config}
        onChange={updateConfig}
        accounts={accounts}
        accountsLoading={accountsLoading}
      />

      <HudPanel className={styles.chartPanel}>
        <PanelLabel label={DATA_LABELS[config.dataType]} />
        {isLoading ? (
          <Spinner />
        ) : (
          <Chart
            transactions={transactions}
            categories={categories}
            dataType={config.dataType}
            chartType={config.chartType}
          />
        )}
      </HudPanel>
    </div>
  );
};

export default ChartViewer;
