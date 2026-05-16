import { useState } from "react";
import type { Category } from "@/types";
import UserSectionList from "@/components/organisms/UserSectionList/UserSectionList";
import UserSectionItem from "@/components/molecules/UserSectionItem/UserSectionItem";
import CategoryForm from "@/components/organisms/CategoryForm/CategoryForm";
import Modal from "@/components/templates/Modal/Modal";
import Spinner from "@/components/atoms/Spinner/Spinner";
import { useGetCategoriesQuery } from "@/services/categoryApi";
import styles from "./CategorySection.module.css";

const CategorySection = () => {
  const { data: categories = [], isLoading } = useGetCategoriesQuery();
  const [selected, setSelected] = useState<Category | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  if (isLoading) return <Spinner />;

  return (
    <div className={styles.container}>
      <Modal
        isOpen={isAdding}
        onClose={() => setIsAdding(false)}
        title="New Category"
      >
        <CategoryForm onClose={() => setIsAdding(false)} />
      </Modal>
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title="Edit Category"
      >
        {selected && (
          <CategoryForm category={selected} onClose={() => setSelected(null)} />
        )}
      </Modal>
      <UserSectionList
        title="Income categories"
        onAdd={() => setIsAdding(true)}
      >
        {categories
          .filter((c) => c.type === "income")
          .map((category) => (
            <UserSectionItem
              key={category._id}
              label={category.name}
              indicator={category.colour}
              onEdit={
                category.isDefault ? undefined : () => setSelected(category)
              }
            />
          ))}
      </UserSectionList>
      <UserSectionList
        title="Expense categories"
        onAdd={() => setIsAdding(true)}
      >
        {categories
          .filter((c) => c.type === "expense")
          .map((category) => (
            <UserSectionItem
              key={category._id}
              label={category.name}
              indicator={category.colour}
              onEdit={
                category.isDefault ? undefined : () => setSelected(category)
              }
            />
          ))}
      </UserSectionList>
    </div>
  );
};

export default CategorySection;
