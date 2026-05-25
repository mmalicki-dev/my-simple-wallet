import { type ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackgroundGrid } from "@/components/atoms/BackgroundGrid/BackgroundGrid";
import { useColors } from "@/hooks";

interface ScreenLayoutProps {
  children: ReactNode;
}

export const ScreenLayout = ({ children }: ScreenLayoutProps) => {
  const colors = useColors();
  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <BackgroundGrid />
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.content}>{children}</View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  content: {
    flex: 1,
    alignItems: "stretch",
    padding: 16,
    paddingTop: 28,
    gap: 24,
  },
});
