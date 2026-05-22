import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GlassWrapper } from "@/components/templates/GlassWrapper/GlassWrapper";
import { AuthTabs } from "@/components/atoms/AuthTabs/AuthTabs";
import { useState } from "react";
import { AuthForm } from "@/components/molecules/AuthForm/AuthForm";

type Mode = "login" | "register";

const AuthScreen = () => {
  const [mode, setMode] = useState<Mode>("login");

  const changeMode = (tab: "login" | "register") => setMode(tab);

  return (
    <SafeAreaView>
      <View>{/*Toggle theme and language */}</View>
      <GlassWrapper>
        <AuthTabs currentTab={mode} onPress={changeMode} />
        <AuthForm mode={mode} />
      </GlassWrapper>
    </SafeAreaView>
  );
};

export default AuthScreen;
