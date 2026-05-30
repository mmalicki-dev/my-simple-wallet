import { Pressable, View, Platform, StyleSheet } from "react-native";
import { useColors } from "@/hooks";

interface ChartOptionProps {
  checked: boolean;
  onPress: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

const ChartOption = ({
  checked,
  onPress,
  disabled,
  children,
}: ChartOptionProps) => {
  const colors = useColors();
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      style={[styles.option, disabled && styles.optionDisabled]}
    >
      <View
        style={[
          styles.indicator,
          {
            borderColor: checked ? colors.neon : `${colors.neon}80`,
            backgroundColor: checked ? `${colors.neon}2E` : "transparent",
          },
          checked && Platform.OS === "ios"
            ? {
                shadowColor: colors.neon,
                shadowOpacity: 0.65,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 0 },
              }
            : undefined,
        ]}
      >
        {checked && (
          <View
            style={[styles.indicatorFill, { backgroundColor: colors.neon }]}
          />
        )}
      </View>
      <View style={styles.optionLabel}>{children}</View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 4,
  },
  optionDisabled: { opacity: 0.35 },
  optionLabel: { flexDirection: "row", alignItems: "center", gap: 6 },
  indicator: {
    width: 10,
    height: 10,
    transform: [{ rotate: "45deg" }],
    borderWidth: 1.5,
  },
  indicatorFill: {
    position: "absolute",
    top: 2,
    left: 2,
    right: 2,
    bottom: 2,
  },
});

export default ChartOption;
