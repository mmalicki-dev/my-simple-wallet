import type { Currency } from "shared";
import type { Account } from "@/types";
import { useTotalBalance } from "@/hooks";
import Amount from "@/components/atoms/Amount/Amount";
import Spinner from "@/components/atoms/Spinner/Spinner";
import styles from "./TotalBalance.module.css";
import { ReactNode } from "react";

interface TotalBalanceProps {
  accounts: Account[];
  baseCurrency: Currency;
}

const TotalBalance = ({ accounts, baseCurrency }: TotalBalanceProps) => {
  const { total, isLoading, isError } = useTotalBalance(accounts, baseCurrency);

  return (
    <div className={styles.wrapper}>
      <span className={styles.label}>Total balance</span>
      {isLoading && <Spinner />}
      {isError && <span className={styles.error}>Could not load rates</span>}
      {!isError && !isLoading && (
        <div className={styles.amountWrapper}>
          <Amount
            value={total!}
            currency={baseCurrency}
            className={styles.amount}
          />
          <span className={styles.disclaimer}>approximate</span>
        </div>
      )}
    </div>
  );
};

export default TotalBalance;
