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
import { useBreakpoint } from "@/hooks/useBreakpoint";

interface ScreenLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const ScreenLayout = ({
  children,
  sidebar,
  style,
}: ScreenLayoutProps) => {
  const colors = useColors();
  const breakpoint = useBreakpoint();
  const isWide = breakpoint === "lg" && !!sidebar;

  return (
    <View style={[styles.root, { backgroundColor: colors.bg }]}>
      <BackgroundGrid />
      <SafeAreaView
        style={[styles.safe, isWide && styles.safeRow]}
        edges={["top"]}
      >
        <ScrollView contentContainerStyle={[styles.content, style]}>
          {children}
          {!isWide && sidebar}
        </ScrollView>
        {isWide && (
          <ScrollView contentContainerStyle={styles.content}>
            {sidebar}
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
  safeRow: { flexDirection: "row" },
  content: {
    alignItems: "stretch",
    flexGrow: 1,
    padding: 16,
    paddingTop: 28,
    gap: 30,
  },
});
