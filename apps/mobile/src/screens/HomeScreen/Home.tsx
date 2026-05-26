import { ScreenLayout } from "@/components/templates/ScreenLayout/ScreenLayout";
import { TotalBalance } from "@/components/molecules/TotalBalance/TotalBalance";
import { useGetAccountsQuery } from "@/services";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { HudPanel } from "@/components/templates/HudPanel/HudPanel";
import { AccountBlock } from "@/components/organisms/AccountBlock/AccountBlock";
import { RecurringPaymentBlock } from "@/components/organisms/RecurringPaymentBlock/RecurringPaymentBlock";
import { useRecurringPayments } from "@/hooks";
import { SkeletonLoader } from "@/components/atoms/SkeletonLoader/SkeletonLoader";

const HomeScreen = () => {
  const { data: accounts = [], isLoading: isLoadingA } = useGetAccountsQuery();
  const {
    loans,
    subscriptions,
    isLoading: isLoadingRP,
  } = useRecurringPayments();
  const totalBalanceCurrency = useSelector(
    (state: RootState) => state.auth.user?.totalBalanceCurrency,
  );

  return (
    <ScreenLayout>
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
      {(isLoadingRP || loans.length > 0) && (
        <HudPanel label="Your Loans">
          {isLoadingRP && <SkeletonLoader />}
          {!isLoadingRP && <RecurringPaymentBlock type="loan" payments={loans} />}
        </HudPanel>
      )}
      {(isLoadingRP || subscriptions.length > 0) && (
        <HudPanel label="Your Subscriptions">
          {isLoadingRP && <SkeletonLoader />}
          {!isLoadingRP && (
            <RecurringPaymentBlock type="subscription" payments={subscriptions} />
          )}
        </HudPanel>
      )}
    </ScreenLayout>
  );
};

export default HomeScreen;
