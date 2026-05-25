import { type ReactNode } from "react";
import { View, StyleSheet } from "react-native";
import { useColors } from "@/hooks";
import { alpha } from "@/theme/colors";

interface HudPanelProps {
  children: ReactNode;
  style?: object;
}

const CORNER = 14;
const BORDER = 2;

export const HudPanel = ({ children, style }: HudPanelProps) => {
  const colors = useColors();
  return (
    <View
      style={[
        styles.panel,
        {
          backgroundColor: alpha(colors.surface, 0.4),
          shadowColor: colors.neon,
        },
        style,
      ]}
    >
      <View style={[styles.corner, styles.tl, { borderColor: colors.neon }]} />
      <View style={[styles.corner, styles.tr, { borderColor: colors.neon }]} />
      <View style={[styles.corner, styles.bl, { borderColor: colors.neon }]} />
      <View style={[styles.corner, styles.br, { borderColor: colors.neon }]} />
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    padding: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  corner: {
    position: "absolute",
    width: CORNER,
    height: CORNER,
    borderWidth: BORDER,
  },
  tl: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tr: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bl: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  br: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
});
