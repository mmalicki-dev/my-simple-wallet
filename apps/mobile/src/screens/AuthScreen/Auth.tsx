import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GlassWrapper } from "@/components/templates/GlassWrapper/GlassWrapper";
import { AuthTabs } from "@/components/atoms/AuthTabs/AuthTabs";
import { AuthForm } from "@/components/molecules/AuthForm/AuthForm";
import { ThemeToggle } from "@/components/atoms/ThemeToggle/ThemeToggle";
import { LanguageToggle } from "@/components/atoms/LanguageToggle/LanguageToggle";

type Mode = "login" | "register";

const AuthScreen = () => {
  const [mode, setMode] = useState<Mode>("login");

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.content}>
        <View style={styles.controls}>
          <ThemeToggle />
          <LanguageToggle />
        </View>
        <GlassWrapper>
          <AuthTabs currentTab={mode} onPress={setMode} />
          <AuthForm mode={mode} />
        </GlassWrapper>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 16,
  },
  controls: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
});

export default AuthScreen;
