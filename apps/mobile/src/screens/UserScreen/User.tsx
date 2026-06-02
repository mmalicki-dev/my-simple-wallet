import { useState } from "react";
import { ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { ScreenLayout } from "@/components/templates/ScreenLayout/ScreenLayout";
import { Toggle } from "@/components/atoms/Toggle/Toggle";
import ProfileSection from "@/components/organisms/ProfileSection/ProfileSection";
import AccountSection from "@/components/organisms/AccountSection/AccountSection";
import CategorySection from "@/components/organisms/CategorySection/CategorySection";
import RecurringSection from "@/components/organisms/RecurringSection/RecurringSection";

const TABS = [
  { value: "profile", label: "Profile" },
  { value: "accounts", label: "Accounts" },
  { value: "categories", label: "Categories" },
  { value: "recurring", label: "Recurring" },
];

const UserScreen = () => {
  const [tab, setTab] = useState("profile");

  return (
    <ScreenLayout style={{ flex: 1 }}>
      <Toggle options={TABS} value={tab} onChange={setTab} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {tab === "profile" && <ProfileSection />}
          {tab === "accounts" && <AccountSection />}
          {tab === "categories" && <CategorySection />}
          {tab === "recurring" && <RecurringSection />}
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenLayout>
  );
};

export default UserScreen;
