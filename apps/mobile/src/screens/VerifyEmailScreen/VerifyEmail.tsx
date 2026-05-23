import { View, Text, StyleSheet } from "react-native";
import { ScreenLayout } from "@/components/templates/ScreenLayout/ScreenLayout";
import { useColors } from "@/hooks";

const VerifyEmailScreen = () => {
  const colors = useColors();
  return (
    <ScreenLayout>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Verify Email</Text>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  content: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "700" },
});

export default VerifyEmailScreen;
