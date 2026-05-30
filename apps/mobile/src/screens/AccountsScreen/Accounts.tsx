import { ScrollView } from "react-native";
import { ScreenLayout } from "@/components/templates/ScreenLayout/ScreenLayout";
import AccountSection from "@/components/organisms/AccountSection/AccountSection";

const AccountsScreen = () => (
  <ScreenLayout>
    <ScrollView showsVerticalScrollIndicator={false}>
      <AccountSection />
    </ScrollView>
  </ScreenLayout>
);

export default AccountsScreen;
