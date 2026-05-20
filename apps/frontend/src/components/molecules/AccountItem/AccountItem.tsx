import type { Account } from "shared";
import Amount from "@/components/atoms/Amount/Amount";
import ActionPanel from "@/components/molecules/ActionPanel/ActionPanel";
import styles from "./AccountItem.module.css";

interface AccountItemProps {
  account: Account;
  onViewMore?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onSelect?: () => void;
  isSelected?: boolean;
}

const AccountItem = ({
  account,
  onViewMore,
  onEdit,
  onDelete,
  onSelect,
  isSelected,
}: AccountItemProps) => {
  return (
    <li
      className={[styles.item, isSelected ? styles.selected : undefined]
        .filter(Boolean)
        .join(" ")}
    >
      <ActionPanel
        className={styles.account}
        onViewMore={onViewMore}
        onEdit={onEdit}
        onDelete={onDelete}
      >
        <button
          type="button"
          className={styles.content}
          onClick={(e) => {
            e.stopPropagation();
            onSelect?.();
          }}
        >
          <div className={styles.info}>
            <span className={styles.name}>{account.name}</span>
            <Amount
              value={account.balance}
              currency={account.currency}
              className={styles.balance}
            />
          </div>
          <span className={[styles.type, styles[account.type]].join(" ")}>
            {account.type.toUpperCase()}
          </span>
        </button>
      </ActionPanel>
    </li>
  );
};

export default AccountItem;
