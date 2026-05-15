import type { Category } from "@/types";
import type { CategoryIconName } from "shared";
import Icon from "@/components/atoms/Icon/Icon";
import styles from "./CategoryPicker.module.css";

interface CategoryPickerProps {
  categories: Category[];
  value: string;
  onChange: (id: string) => void;
}

const CategoryPicker = ({
  categories,
  value,
  onChange,
}: CategoryPickerProps) => {
  return (
    <div className={styles.grid}>
      {categories.map((cat) => {
        const isSelected = cat._id === value;
        return (
          <button
            key={cat._id}
            type="button"
            className={[styles.tile, isSelected ? styles.selected : ""].join(
              " ",
            )}
            style={
              isSelected
                ? ({ "--cat-colour": cat.colour } as React.CSSProperties)
                : undefined
            }
            onClick={() => onChange(cat._id)}
          >
            {cat.icon && (
              <Icon
                name={cat.icon as CategoryIconName}
                className={styles.icon}
              />
            )}
            <span className={styles.name}>{cat.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default CategoryPicker;
