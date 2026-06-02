import { type ReactNode } from "react";
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackgroundGrid } from "@/components/atoms/BackgroundGrid/BackgroundGrid";
import { useColors } from "@/hooks";

interface ScreenLayoutProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const ScreenLayout = ({ children, style }: ScreenLayoutProps) => {
  const colors = useColors();
  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <BackgroundGrid />
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <ScrollView contentContainerStyle={[styles.content, style]}>
          {children}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  content: {
    alignItems: "stretch",
    flexGrow: 1,
    padding: 16,
    paddingTop: 28,
    gap: 30,
  },
});
