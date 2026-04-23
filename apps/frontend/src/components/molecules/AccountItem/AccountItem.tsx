import type { Account } from "@/types";
import Amount from "@/components/atoms/Amount/Amount";
import styles from "./AccountItem.module.css";
import AccentPanel from "@/components/templates/AccentPanel/AccentPanel";

interface AccountItemProps {
  account: Account;
  onClick?: () => void;
}

const AccountItem = ({ account, onClick }: AccountItemProps) => {
  return (
    <li>
      <button
        className={styles.item}
        onClick={onClick}
        role={onClick ? "button" : undefined}
      >
        <AccentPanel className={styles.account}>
          <span className={styles.name}>{account.name}</span>
          <Amount
            value={account.balance}
            currency={account.currency}
            className={styles.balance}
          />
        </AccentPanel>
      </button>
    </li>
  );
};

export default AccountItem;
