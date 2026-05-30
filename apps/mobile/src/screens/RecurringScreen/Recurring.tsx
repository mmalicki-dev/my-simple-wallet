import { ScrollView } from "react-native";
import { ScreenLayout } from "@/components/templates/ScreenLayout/ScreenLayout";
import RecurringSection from "@/components/organisms/RecurringSection/RecurringSection";

const RecurringScreen = () => (
  <ScreenLayout>
    <ScrollView showsVerticalScrollIndicator={false}>
      <RecurringSection />
    </ScrollView>
  </ScreenLayout>
);

export default RecurringScreen;
