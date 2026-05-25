import { useState, useEffect, useRef, type ReactNode } from "react";
import { View, Pressable, StyleSheet, DeviceEventEmitter } from "react-native";
import Svg, { Defs, LinearGradient, Stop, Rect } from "react-native-svg";
import { QuickActions } from "@/components/molecules/QuickActions/QuickActions";
import { useColors } from "@/hooks";

interface ActionPanelProps {
  children: ReactNode;
  withBorderBottom?: boolean;
  onPress?: () => void;
  onViewMore?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const EVENT = "actionpanel:open";
let counter = 0;

export const ActionPanel = ({
  children,
  onViewMore,
  onEdit,
  onDelete,
  onPress,
  withBorderBottom = false,
}: ActionPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const id = useRef(++counter).current;
  const colors = useColors();

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener(EVENT, (openedId: number) => {
      if (openedId !== id) setIsOpen(false);
    });
    return () => sub.remove();
  }, [id]);

  const open = () => {
    setIsOpen((v) => {
      if (!v) DeviceEventEmitter.emit(EVENT, id);
      return !v;
    });
  };

  return (
    <View style={styles.wrapper}>
      <Pressable
        style={styles.content}
        onPress={() => {
          onPress?.();
          open();
        }}
      >
        <Svg style={styles.borderRight} width={2}>
          <Defs>
            <LinearGradient id="vgrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={colors.primary} stopOpacity="0" />
              <Stop offset="1" stopColor={colors.primary} stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="2" height="100%" fill="url(#vgrad)" />
        </Svg>
        {children}
      </Pressable>
      {withBorderBottom && (
        <Svg style={styles.borderBottom} width={"100%"} height={2}>
          <Defs>
            <LinearGradient id="hgrad" x1="1" y1="0" x2="0" y2="0">
              <Stop offset="0" stopColor={colors.primary} stopOpacity="1" />
              <Stop offset="1" stopColor={colors.primary} stopOpacity="0" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="100%" height="2" fill="url(#hgrad)" />
        </Svg>
      )}
      <QuickActions
        isOpen={isOpen}
        onViewMore={onViewMore}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "stretch",
  },
  borderBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  borderRight: {
    position: "absolute",
    right: 0,
    bottom: 0,
    top: 0,
  },
  content: {
    flex: 1,
  },
});
