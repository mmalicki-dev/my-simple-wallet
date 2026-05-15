import { useState } from "react";
import type { Category, CreateCategoryRequest } from "@/types";
import FormActions from "@/components/molecules/FormActions/FormActions";
import Form from "../Form/Form";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/services/categoryApi";
import { CATEGORY_ICON_NAMES } from "shared";

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
          label: "type",
          placeholder: "Select type",
          handleChange: handleChange,
          value: form.type,
          optionsArray: ["expense", "income"],
        },
        {
          type: "select",
          id: "icon",
          label: "icon",
          placeholder: "Select icon",
          handleChange: handleChange,
          value: form.icon!,
          optionsArray: [...CATEGORY_ICON_NAMES],
        },
      ]}
    >
      <FormActions
        onCancel={onClose}
        onDelete={category ? handleDelete : undefined}
        submitLabel={category ? "Save" : "Create"}
      />
    </Form>
  );
};

export default CategoryForm;
