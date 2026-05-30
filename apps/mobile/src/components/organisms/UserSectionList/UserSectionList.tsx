import { type ReactNode } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useColors } from "@/hooks";
import { alpha } from "@/theme/colors";

interface UserSectionListProps {
  title: string;
  onAdd?: () => void;
  children: ReactNode;
}

const UserSectionList = ({ title, onAdd, children }: UserSectionListProps) => {
  const colors = useColors();
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.neon }]}>{title}</Text>
        {onAdd && (
          <Pressable
            onPress={onAdd}
            style={[styles.addBtn, { borderLeftColor: alpha(colors.neon, 0.5) }]}
          >
            <Text style={[styles.addBtnText, { color: alpha(colors.neon, 0.7) }]}>
              + Add
            </Text>
          </Pressable>
        )}
      </View>
      <View>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: { paddingVertical: 10 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  title: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 3.2,
    textTransform: "uppercase",
  },
  addBtn: {
    height: 20,
    paddingHorizontal: 8,
    justifyContent: "center",
    borderLeftWidth: 2,
  },
  addBtnText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
});

export default UserSectionList;
