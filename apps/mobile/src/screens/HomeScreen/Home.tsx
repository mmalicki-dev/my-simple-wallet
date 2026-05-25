import { ScreenLayout } from "@/components/templates/ScreenLayout/ScreenLayout";
import { TotalBalance } from "@/components/molecules/TotalBalance/TotalBalance";
import { useGetAccountsQuery } from "@/services";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { HudPanel } from "@/components/templates/HudPanel/HudPanel";

const HomeScreen = () => {
  const { data: accounts = [], isLoading } = useGetAccountsQuery();
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
    </ScreenLayout>
  );
};

export default HomeScreen;
