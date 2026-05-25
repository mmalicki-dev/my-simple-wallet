import { ScreenLayout } from "@/components/templates/ScreenLayout/ScreenLayout";
import { TotalBalance } from "@/components/molecules/TotalBalance/TotalBalance";
import { useGetAccountsQuery } from "@/services";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { HudPanel } from "@/components/templates/HudPanel/HudPanel";
import { Text } from "react-native";

const HomeScreen = () => {
  const { data: accounts = [], isLoading } = useGetAccountsQuery();
  const totalBalanceCurrency = useSelector(
    (state: RootState) => state.auth.user?.totalBalanceCurrency,
  );

  if (isLoading)
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
    </ScreenLayout>
  );
};

export default HomeScreen;
