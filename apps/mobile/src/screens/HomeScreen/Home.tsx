import { ScreenLayout } from "@/components/templates/ScreenLayout/ScreenLayout";
import { TotalBalance } from "@/components/molecules/TotalBalance/TotalBalance";
import {
  useGetAccountsQuery,
  useGetCategoriesQuery,
  useGetTransactionsQuery,
} from "@/services";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { HudPanel } from "@/components/templates/HudPanel/HudPanel";
import { AccountBlock } from "@/components/organisms/AccountBlock/AccountBlock";
import { RecurringPaymentBlock } from "@/components/organisms/RecurringPaymentBlock/RecurringPaymentBlock";
import { useRecurringPayments } from "@/hooks";
import { SkeletonLoader } from "@/components/atoms/SkeletonLoader/SkeletonLoader";
import ChartView from "@/components/organisms/ChartView/ChartView";
import { useMemo } from "react";
import { Text } from "react-native";

const isoDate = (d: Date) => d.toISOString().slice(0, 10);

const currentMonthRange = () => {
  const today = new Date();
  const from = new Date(today.getFullYear(), today.getMonth(), 1);
  return { from: isoDate(from), to: isoDate(today) };
};

const HomeScreen = () => {
  const { from, to } = currentMonthRange();
  const { data: accounts = [], isLoading: isLoadingA } = useGetAccountsQuery();
  const { data: txData, isLoading: txLoading } = useGetTransactionsQuery(
    { from, to, accountId: accounts.find((a) => a.isDefault)?._id },
    { skip: !accounts.find((a) => a.isDefault)?._id },
  );
  const {
    loans,
    subscriptions,
    isLoading: isLoadingRP,
  } = useRecurringPayments();
  const { data: categories = [], isLoading: categoriesLoading } =
    useGetCategoriesQuery();
  const totalBalanceCurrency = useSelector(
    (state: RootState) => state.auth.user?.totalBalanceCurrency,
  );

  const allTransactions = useMemo(
    () =>
      (txData?.transactions ?? [])
        .filter((t) => t.status === "posted")
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        ),
    [txData],
  );

  const HomeRightPanel = () => {
    return (
      <>
        <HudPanel label="Recent Transactions">
          {txLoading ? (
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
          {txLoading || categoriesLoading ? (
            <SkeletonLoader />
          ) : (
            <ChartView
              transactions={allTransactions}
              categories={categories}
              dataType="cashflow"
              chartType="bar"
            />
          )}
        </HudPanel>
      </>
    );
  };

  return (
    <ScreenLayout sidebar={<HomeRightPanel />}>
      <HudPanel label="Total Balance">
        <TotalBalance
          accounts={accounts}
          baseCurrency={totalBalanceCurrency ?? "NOK"}
        />
      </HudPanel>
      <HudPanel label="Your Accounts">
        {isLoadingA && <SkeletonLoader />}
        {!isLoadingA && <AccountBlock />}
      </HudPanel>
      <HudPanel label="Your Loans">
        <RecurringPaymentBlock type="loan" payments={loans} />
      </HudPanel>
      <HudPanel label="Your Subscriptions">
        {isLoadingRP && <SkeletonLoader />}
        {!isLoadingRP && (
          <RecurringPaymentBlock type="loan" payments={subscriptions} />
        )}
      </HudPanel>
    </ScreenLayout>
  );
};

export default HomeScreen;
