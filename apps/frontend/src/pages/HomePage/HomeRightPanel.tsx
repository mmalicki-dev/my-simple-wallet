import { useMemo } from "react";
import { useGetAccountsQuery } from "@/services/accountApi";
import { useGetTransactionsQuery } from "@/services/transactionApi";
import { useGetCategoriesQuery } from "@/services/categoryApi";
import HudPanel from "@/components/templates/HudPanel/HudPanel";
import TransactionList from "@/components/organisms/TransactionList/TransactionList";
import Chart from "@/components/organisms/Chart/Chart";
import PanelLabel from "@/components/atoms/PanelLabel/PanelLabel";
import Spinner from "@/components/atoms/Spinner/Spinner";
import styles from "./HomeRightPanel.module.css";

const isoDate = (d: Date) => d.toISOString().slice(0, 10);

const currentMonthRange = () => {
  const today = new Date();
  const from = new Date(today.getFullYear(), today.getMonth(), 1);
  return { from: isoDate(from), to: isoDate(today) };
};

interface HomeRightPanelProps {
  accountId?: string;
}

const HomeRightPanel = ({ accountId }: HomeRightPanelProps) => {
  const { data: accounts = [] } = useGetAccountsQuery();
  const currency = useMemo(
    () => accounts.find((a) => a._id === accountId)?.currency ?? "USD",
    [accounts, accountId],
  );

  const { from, to } = currentMonthRange();

  const { data: txData, isLoading: txLoading } = useGetTransactionsQuery(
    { from, to, accountId },
    { skip: !accountId },
  );

  const { data: categories = [], isLoading: categoriesLoading } =
    useGetCategoriesQuery();

  const allTransactions = useMemo(
    () =>
      (txData?.transactions ?? [])
        .filter((t) => t.status === "posted")
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        ),
    [txData],
  );

  return (
    <div className={styles.panel}>
      <HudPanel className={styles.txPanel}>
        <PanelLabel label="Recent Transactions" />
        {txLoading ? (
          <Spinner />
        ) : (
          <div className={styles.txScroll}>
            <TransactionList
              transactions={allTransactions}
              currency={currency}
              isLoading={false}
            />
          </div>
        )}
      </HudPanel>

      <HudPanel>
        <PanelLabel label="Cashflow — This Month" />
        {txLoading || categoriesLoading ? (
          <Spinner />
        ) : (
          <Chart
            transactions={allTransactions}
            categories={categories}
            dataType="cashflow"
            chartType="bar"
          />
        )}
      </HudPanel>
    </div>
  );
};

export default HomeRightPanel;
