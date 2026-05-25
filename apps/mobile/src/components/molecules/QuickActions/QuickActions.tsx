import { useEffect, useRef } from "react";
import { View, Text, Pressable, Animated, StyleSheet } from "react-native";
import { Icon } from "@/components/atoms/Icon/Icon";
import { useColors } from "@/hooks";
import { alpha } from "@/theme/colors";
import type { IconName } from "shared";

interface Action {
  icon: IconName;
  label: string;
  onPress: () => void;
  danger?: boolean;
}

interface QuickActionsProps {
  isOpen: boolean;
  onViewMore?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const QuickActions = ({ isOpen, onViewMore, onEdit, onDelete }: QuickActionsProps) => {
  const colors = useColors();
  const width = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(width, {
      toValue: isOpen ? 1 : 0,
      duration: 220,
      useNativeDriver: false,
    }).start();
  }, [isOpen, width]);

  const actions: Action[] = [
    ...(onViewMore ? [{ icon: "list-arrow-down" as IconName, label: "Txns", onPress: onViewMore }] : []),
    ...(onEdit ? [{ icon: "pen-edit-round" as IconName, label: "Edit", onPress: onEdit }] : []),
    ...(onDelete ? [{ icon: "trash-bin" as IconName, label: "Delete", onPress: onDelete, danger: true }] : []),
  ];

  if (actions.length === 0) return null;

  const maxWidth = width.interpolate({ inputRange: [0, 1], outputRange: [0, actions.length * 64] });

  return (
    <Animated.View
      style={[
        styles.panel,
        {
          maxWidth,
          borderBottomColor: colors.neon,
          backgroundColor: alpha(colors.neon, 0.06),
        },
      ]}
    >
      {actions.map((action) => (
        <Pressable
          key={action.label}
          style={({ pressed }) => [
            styles.btn,
            pressed && { backgroundColor: alpha(action.danger ? colors.danger : colors.neon, 0.12) },
          ]}
          onPress={action.onPress}
        >
          <Icon
            name={action.icon}
            size={16}
            color={action.danger ? colors.danger : colors.neon}
          />
          <Text style={[styles.label, { color: action.danger ? colors.danger : colors.neon }]}>
            {action.label.toUpperCase()}
          </Text>
        </Pressable>
      ))}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  panel: {
    flexDirection: "row",
    alignItems: "stretch",
    overflow: "hidden",
    borderBottomWidth: 2,
  },
  btn: {
    width: 64,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingVertical: 4,
  },
  label: {
    fontSize: 9,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
});
