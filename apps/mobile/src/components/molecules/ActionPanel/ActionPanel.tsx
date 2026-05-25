import { useState, type ReactNode } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { QuickActions } from "@/components/molecules/QuickActions/QuickActions";

interface ActionPanelProps {
  children: ReactNode;
  onViewMore?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const ActionPanel = ({ children, onViewMore, onEdit, onDelete }: ActionPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Pressable style={styles.content} onPress={() => setIsOpen((v) => !v)}>
        {children}
      </Pressable>
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
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
});
