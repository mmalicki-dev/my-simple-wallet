import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import type { Category, CreateCategoryRequest, TransactionType } from "shared";
import { CATEGORY_ICON_NAMES } from "shared";
import { FormInput } from "@/components/atoms/FormInput/FormInput";
import { Toggle } from "@/components/atoms/Toggle/Toggle";
import { NeonButton } from "@/components/atoms/NeonButton/NeonButton";
import { Icon } from "@/components/atoms/Icon/Icon";
import { useColors } from "@/hooks";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/services/categoryApi";
import { sectionLabel } from "@/styles/typography";
import type { CategoryIconName } from "shared";

const PRESET_COLOURS = [
  "#6366f1",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
  "#64748b",
];

interface CategoryFormProps {
  category?: Category;
  onClose: () => void;
}

const CategoryForm = ({ category, onClose }: CategoryFormProps) => {
  const colors = useColors();
  const [type, setType] = useState<TransactionType>(
    category?.type ?? "expense",
  );
  const [name, setName] = useState(category?.name ?? "");
  const [colour, setColour] = useState(category?.colour ?? "#6366f1");
  const [icon, setIcon] = useState<string>(category?.icon ?? "");

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleSubmit = async () => {
    if (category) {
      await updateCategory({
        id: category._id,
        body: { name, type, colour, icon },
      });
    } else {
      const body: CreateCategoryRequest = { name, type, icon, colour };
      await createCategory(body);
    }
    onClose();
  };

  const handleDelete = async () => {
    if (!category) return;
    await deleteCategory({ id: category._id });
    onClose();
  };

  return (
    <View style={styles.form}>
      <Toggle
        options={[
          { value: "expense", label: "Expense" },
          { value: "income", label: "Income" },
        ]}
        value={type}
        onChange={(val) => setType(val as TransactionType)}
      />

      <FormInput
        label="Name"
        value={name}
        onChangeText={setName}
        placeholder="e.g. Food & Drinks"
      />

      <View style={styles.field}>
        <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>
          Colour
        </Text>
        <View style={styles.colourRow}>
          {PRESET_COLOURS.map((c) => (
            <Pressable
              key={c}
              onPress={() => setColour(c)}
              style={[
                styles.colourSwatch,
                { backgroundColor: c },
                colour === c && [
                  styles.colourSwatchActive,
                  { borderColor: colors.text },
                ],
              ]}
            />
          ))}
        </View>
      </View>

      <View style={styles.field}>
        <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>
          Icon
        </Text>
        <View style={styles.iconGrid}>
          {CATEGORY_ICON_NAMES.map((iconName: CategoryIconName) => (
            <Pressable
              key={iconName}
              onPress={() => setIcon(iconName)}
              style={[
                styles.iconBtn,
                {
                  borderColor:
                    icon === iconName ? colors.neon : "transparent",
                  backgroundColor:
                    icon === iconName ? `${colors.neon}22` : "transparent",
                },
              ]}
            >
              <Icon
                name={iconName}
                size={20}
                color={icon === iconName ? colors.neon : colors.textMuted}
              />
            </Pressable>
          ))}
        </View>
      </View>

      <NeonButton
        label={category ? "Save" : "Create"}
        onPress={handleSubmit}
      />
      {category && (
        <NeonButton label="Delete" variant="danger" onPress={handleDelete} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  form: { gap: 20 },
  field: { gap: 8 },
  fieldLabel: sectionLabel,
  colourRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  colourSwatch: {
    width: 28,
    height: 28,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "transparent",
  },
  colourSwatchActive: {
    borderWidth: 2,
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    borderWidth: 1,
  },
});

export default CategoryForm;
