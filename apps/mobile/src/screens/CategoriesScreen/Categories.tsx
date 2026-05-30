import { ScrollView } from "react-native";
import { ScreenLayout } from "@/components/templates/ScreenLayout/ScreenLayout";
import CategorySection from "@/components/organisms/CategorySection/CategorySection";

const CategoriesScreen = () => (
  <ScreenLayout>
    <ScrollView showsVerticalScrollIndicator={false}>
      <CategorySection />
    </ScrollView>
  </ScreenLayout>
);

export default CategoriesScreen;
