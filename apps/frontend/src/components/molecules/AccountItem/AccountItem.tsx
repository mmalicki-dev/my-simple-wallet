import type { Account } from "@/types";
import Amount from "@/components/atoms/Amount/Amount";
import styles from "./AccountItem.module.css";

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
        <span className={styles.name}>{account.name}</span>
        <Amount
          value={account.balance}
          currency={account.currency}
          className={styles.balance}
        />
      </button>
    </li>
  );
};

export default AccountItem;
