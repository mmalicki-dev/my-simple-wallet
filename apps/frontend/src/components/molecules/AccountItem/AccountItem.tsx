import { useState } from "react";
import type { Account } from "@/types";
import Amount from "@/components/atoms/Amount/Amount";
import AccentPanel from "@/components/templates/AccentPanel/AccentPanel";
import QuickActions from "@/components/molecules/QuickActions/QuickActions";
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li
      className={styles.item}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className={styles.wrapper}>
        <AccentPanel className={styles.account} hideBorder={isOpen}>
          <button
            className={styles.content}
            onClick={() => setIsOpen((t) => !t)}
            tabIndex={0}
          >
            <span className={styles.name}>{account.name}</span>
            <Amount
              value={account.balance}
              currency={account.currency}
              className={styles.balance}
            />
          </button>
        </AccentPanel>
        <QuickActions
          isOpen={isOpen}
          onViewMore={onViewMore}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </li>
  );
};

export default AccountItem;
