import type { Account } from "@/types";
import Amount from "@/components/atoms/Amount/Amount";
import ActionPanel from "@/components/molecules/ActionPanel/ActionPanel";
import styles from "./AccountItem.module.css";

interface AccountItemProps {
  account: Account;
  onViewMore?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const AccountItem = ({
  account,
  onViewMore,
  onEdit,
  onDelete,
}: AccountItemProps) => {
  return (
    <li className={styles.item}>
      <ActionPanel
        className={styles.account}
        onViewMore={onViewMore}
        onEdit={onEdit}
        onDelete={onDelete}
      >
        <div className={styles.content}>
          <span className={styles.name}>{account.name}</span>
          <Amount
            value={account.balance}
            currency={account.currency}
            className={styles.balance}
          />
        </div>
      </ActionPanel>
    </li>
  );
};

export default AccountItem;
