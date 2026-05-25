import { ScreenLayout } from "@/components/templates/ScreenLayout/ScreenLayout";
import { TotalBalance } from "@/components/molecules/TotalBalance/TotalBalance";
import { useGetAccountsQuery, useGetRecurringPaymentsQuery } from "@/services";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { HudPanel } from "@/components/templates/HudPanel/HudPanel";
import { Text } from "react-native";
import { AccountBlock } from "@/components/organisms/AccountBlock/AccountBlock";
import { RecurringPaymentBlock } from "@/components/organisms/RecurringPaymentBlock/RecurringPaymentBlock";

const HomeScreen = () => {
  const { data: accounts = [], isLoading: isLoadingA } = useGetAccountsQuery();
  const { data: recurringPayments, isLoading: isLoadingRP } =
    useGetRecurringPaymentsQuery();
  const totalBalanceCurrency = useSelector(
    (state: RootState) => state.auth.user?.totalBalanceCurrency,
  );

  if (isLoadingA)
    return (
      <ScreenLayout>
        <Text>Loading</Text>
      </ScreenLayout>
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
        <AccountBlock />
      </HudPanel>
      <HudPanel label="Your Loans">
        <RecurringPaymentBlock
          type="loan"
          payments={recurringPayments?.filter((rp) => rp.type === "loan") ?? []}
        />
      </HudPanel>
      <HudPanel label="Your Subscriptions">
        <RecurringPaymentBlock
          type="loan"
          payments={
            recurringPayments?.filter((rp) => rp.type === "subscription") ?? []
          }
        />
      </HudPanel>
    </ScreenLayout>
  );
};

export default HomeScreen;
