import { ScreenLayout } from "@/components/templates/ScreenLayout/ScreenLayout";
import { TotalBalance } from "@/components/molecules/TotalBalance/TotalBalance";
import {
  useGetAccountsQuery,
  useGetTransactionsQuery,
} from "@/services";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { HudPanel } from "@/components/templates/HudPanel/HudPanel";
import { AccountBlock } from "@/components/organisms/AccountBlock/AccountBlock";
import { RecurringPaymentBlock } from "@/components/organisms/RecurringPaymentBlock/RecurringPaymentBlock";
import { useRecurringPayments } from "@/hooks";
import { SkeletonLoader } from "@/components/atoms/SkeletonLoader/SkeletonLoader";
import { useMemo } from "react";
import { HomeRightPanel } from "./HomeRightPanel";
import { currentMonthRange } from "@/utils/date";

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

  return (
    <ScreenLayout
      sidebar={
        <HomeRightPanel transactions={allTransactions} isLoading={txLoading} />
      }
    >
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
