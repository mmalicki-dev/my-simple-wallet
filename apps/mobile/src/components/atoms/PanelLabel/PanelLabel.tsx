import { Text, StyleSheet } from "react-native";
import { useColors } from "@/hooks";

interface PanelLabelProps {
  label: string;
  side?: "left" | "right";
}

export const PanelLabel = ({ label, side = "left" }: PanelLabelProps) => {
  const colors = useColors();
  return (
    <Text
      style={[
        styles.label,
        side === "right" ? styles.right : styles.left,
        { color: colors.textMuted },
      ]}
    >
      {label.toUpperCase()}
    </Text>
  );
};

const styles = StyleSheet.create({
  label: {
    position: "absolute",
    top: -20,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.8,
  },
  left: { left: 0 },
  right: { right: 0 },
});
