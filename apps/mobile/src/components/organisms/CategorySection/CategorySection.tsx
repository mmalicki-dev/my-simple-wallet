import type { Category } from "shared";
import { useSectionState } from "@/hooks";
import BottomSheet from "@/components/templates/BottomSheet/BottomSheet";
import UserSectionList from "@/components/organisms/UserSectionList/UserSectionList";
import UserSectionItem from "@/components/molecules/UserSectionItem/UserSectionItem";
import CategoryForm from "@/components/organisms/CategoryForm/CategoryForm";
import { SkeletonLoader } from "@/components/atoms/SkeletonLoader/SkeletonLoader";
import { useGetCategoriesQuery } from "@/services/categoryApi";

const CategorySection = () => {
  const { data: categories = [], isLoading } = useGetCategoriesQuery();
  const { selected, setSelected, isAdding, setIsAdding } = useSectionState<Category>();

  const income = categories.filter((c) => c.type === "income");
  const expense = categories.filter((c) => c.type === "expense");

  if (isLoading) return <SkeletonLoader />;

  return (
    <>
      <BottomSheet
        isVisible={isAdding}
        title="New Category"
        onClose={() => setIsAdding(false)}
      >
        <CategoryForm onClose={() => setIsAdding(false)} />
      </BottomSheet>
      <BottomSheet
        isVisible={!!selected}
        title="Edit Category"
        onClose={() => setSelected(null)}
      >
        {selected && (
          <CategoryForm category={selected} onClose={() => setSelected(null)} />
        )}
      </BottomSheet>
      <UserSectionList
        title="Income categories"
        onAdd={() => setIsAdding(true)}
      >
        {income.map((category) => (
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
        {expense.map((category) => (
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
    </>
  );
};

export default CategorySection;
