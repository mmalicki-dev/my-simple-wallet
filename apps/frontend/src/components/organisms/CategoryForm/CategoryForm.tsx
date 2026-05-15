import { useState } from "react";
import type { Category, CreateCategoryRequest } from "@/types";
import FormActions from "@/components/molecules/FormActions/FormActions";
import IconPicker from "@/components/molecules/IconPicker/IconPicker";
import Form from "../Form/Form";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/services/categoryApi";

interface CategoryFormProps {
  category?: Category;
  onClose: () => void;
}

const CategoryForm = ({ category, onClose }: CategoryFormProps) => {
  const [form, setForm] = useState<Category | CreateCategoryRequest>(
    category ?? { name: "", type: "income", icon: "", colour: "#6366f1" },
  );

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (category) {
      await updateCategory({
        id: category._id,
        body: {
          name: form.name,
          type: form.type,
          colour: form.colour,
          icon: form.icon,
        },
      });
    } else {
      const body: CreateCategoryRequest = {
        name: form.name,
        type: form.type,
        icon: form.icon,
        colour: form.colour,
      };
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
    <Form
      handleChange={handleChange}
      handleSubmit={handleSubmit}
      inputsArray={[
        {
          type: "text",
          id: "name",
          label: "Name",
          placeholder: "fe. Food & Drinks",
          handleChange: handleChange,
          value: form.name,
        },
        {
          type: "color",
          id: "colour",
          label: "Colour",
          placeholder: "Choose colour",
          handleChange: handleChange,
          value: form.colour!,
        },
      ]}
      selectsArray={[
        {
          type: "select",
          id: "type",
          label: "Type",
          placeholder: "Select type",
          handleChange: handleChange,
          value: form.type,
          optionsArray: ["expense", "income"],
        },
      ]}
    >
      <IconPicker
        value={form.icon ?? ""}
        onChange={(name) => setForm((prev) => ({ ...prev, icon: name }))}
      />
      <FormActions
        onCancel={onClose}
        onDelete={category ? handleDelete : undefined}
        submitLabel={category ? "Save" : "Create"}
      />
    </Form>
  );
};

export default CategoryForm;
