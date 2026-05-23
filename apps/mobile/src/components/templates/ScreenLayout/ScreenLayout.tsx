import { type ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Navigation } from "@/components/organisms/Navigation/Navigation";

interface ScreenLayoutProps {
  children: ReactNode;
}

export const ScreenLayout = ({ children }: ScreenLayoutProps) => (
  <SafeAreaView style={styles.screen}>
    <View style={styles.content}>{children}</View>
    <Navigation />
  </SafeAreaView>
);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
