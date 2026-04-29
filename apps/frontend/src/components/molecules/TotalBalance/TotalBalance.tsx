import type { Currency } from "shared";
import type { Account } from "@/types";
import { useTotalBalance } from "@/hooks";
import Amount from "@/components/atoms/Amount/Amount";
import PanelLabel from "@/components/atoms/PanelLabel/PanelLabel";
import SkeletonLoader from "@/components/atoms/SkeletonLoader/SkeletonLoader";
import styles from "./TotalBalance.module.css";

interface TotalBalanceProps {
  accounts: Account[];
  baseCurrency: Currency;
}

const TotalBalance = ({ accounts, baseCurrency }: TotalBalanceProps) => {
  const { total, isLoading, isError } = useTotalBalance(accounts, baseCurrency);

  return (
    <>
      <PanelLabel label="Total balance" />
      {isLoading && <SkeletonLoader className={styles.skeletonWidth} />}
      {isError && <span className={styles.error}>Could not load rates</span>}
      {!isError && !isLoading && (
        <Amount
          value={total!}
          currency={baseCurrency}
          className={styles.amount}
          isApproximate
        />
      )}
    </>
  );
};

export default TotalBalance;
