import { HudPanel } from "@/components/templates/HudPanel/HudPanel";
import { SkeletonLoader } from "@/components/atoms/SkeletonLoader/SkeletonLoader";
import { Text } from "react-native";
import ChartView from "@/components/organisms/ChartView/ChartView";
import { Transaction } from "shared";
import { useGetCategoriesQuery } from "@/services";

const isoDate = (d: Date) => d.toISOString().slice(0, 10);

const currentMonthRange = () => {
  const today = new Date();
  const from = new Date(today.getFullYear(), today.getMonth(), 1);
  return { from: isoDate(from), to: isoDate(today) };
};

interface RightPanelProps {
  isLoading: boolean;
  transactions: Transaction[];
}

export const HomeRightPanel = ({
  isLoading,
  transactions,
}: RightPanelProps) => {
  const { data: categories = [], isLoading: catLoading } =
    useGetCategoriesQuery();

  return (
    <>
      <HudPanel label="Recent Transactions">
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <Text>
            {/* <TransactionList
                  transactions={allTransactions}
                  currency={currency}
                  isLoading={false}
                /> */}
            Here will be TransactionList
          </Text>
        )}
      </HudPanel>

      <HudPanel label="Cashflow — This Month">
        {isLoading || catLoading ? (
          <SkeletonLoader />
        ) : (
          <ChartView
            transactions={transactions}
            categories={categories}
            dataType="cashflow"
            chartType="bar"
          />
        )}
      </HudPanel>
    </>
  );
};
