import Icon from "@/components/atoms/Icon/Icon";
import styles from "./QuickActions.module.css";

interface QuickActionsProps {
  isOpen: boolean;
  onEdit?: () => void;
  onViewMore?: () => void;
  onDelete?: () => void;
}

const QuickActions = ({
  isOpen,
  onEdit,
  onViewMore,
  onDelete,
}: QuickActionsProps) => {
  if (!onEdit && !onViewMore && !onDelete) return null;

  return (
    <div
      className={[styles.panel, isOpen && styles.open]
        .filter(Boolean)
        .join(" ")}
    >
      {onViewMore && (
        <button
          type="button"
          className={styles.btn}
          onClick={onViewMore}
          aria-label="View more"
        >
          <Icon name="list-arrow-down" className={styles.icon} />
        </button>
      )}
      {onEdit && (
        <button
          type="button"
          className={styles.btn}
          onClick={onEdit}
          aria-label="Edit"
        >
          <Icon name="pen-edit-round" className={styles.icon} />
        </button>
      )}
      {onDelete && (
        <button
          type="button"
          className={[styles.btn, styles.deleteBtn].join(" ")}
          onClick={onDelete}
          aria-label="Delete"
        >
          <Icon name="trash-bin" className={styles.icon} />
        </button>
      )}
    </div>
  );
};

export default QuickActions;
