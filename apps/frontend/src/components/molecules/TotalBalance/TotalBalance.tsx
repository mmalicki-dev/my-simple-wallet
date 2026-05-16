import type { Currency } from "shared";
import type { Account } from "@/types";
import { useTotalBalance } from "@/hooks";
import Amount from "@/components/atoms/Amount/Amount";
import PanelLabel from "@/components/atoms/PanelLabel/PanelLabel";
import SkeletonLoader from "@/components/atoms/SkeletonLoader/SkeletonLoader";
import ActionPanel from "@/components/molecules/ActionPanel/ActionPanel";
import styles from "./TotalBalance.module.css";
import { useNavigate, useParams } from "react-router-dom";

interface TotalBalanceProps {
  accounts: Account[];
  baseCurrency: Currency;
}

const TotalBalance = ({ accounts, baseCurrency }: TotalBalanceProps) => {
  const { total, isLoading, isError } = useTotalBalance(accounts, baseCurrency);
  const { lang = "en" } = useParams();
  const navigate = useNavigate();

  return (
    <>
      <PanelLabel label="Total balance" />
      {isLoading && <SkeletonLoader />}
      {isError && <span className={styles.error}>Could not load rates</span>}
      {!isError && !isLoading && (
        <ActionPanel
          onlyRightBorder
          onEdit={() => navigate(`/${lang}/user/profile#preferences`)}
        >
          <Amount
            value={total!}
            currency={baseCurrency}
            className={styles.amount}
            isApproximate
          />
        </ActionPanel>
      )}
    </>
  );
};

export default TotalBalance;
