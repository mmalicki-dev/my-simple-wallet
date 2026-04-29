import type { Currency } from "shared";
import type { Account } from "@/types";
import { useTotalBalance } from "@/hooks";
import Amount from "@/components/atoms/Amount/Amount";
import PanelLabel from "@/components/atoms/PanelLabel/PanelLabel";
import SkeletonLoader from "@/components/atoms/SkeletonLoader/SkeletonLoader";
import styles from "./TotalBalance.module.css";
import AccentPanel from "@/components/templates/AccentPanel/AccentPanel";
import QuickActions from "../QuickActions/QuickActions";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";

interface TotalBalanceProps {
  accounts: Account[];
  baseCurrency: Currency;
}

const TotalBalance = ({ accounts, baseCurrency }: TotalBalanceProps) => {
  const { total, isLoading, isError } = useTotalBalance(accounts, baseCurrency);
  const { lang = "en" } = useParams();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <PanelLabel label="Total balance" />
      {isLoading && <SkeletonLoader />}
      {isError && <span className={styles.error}>Could not load rates</span>}
      {!isError && !isLoading && (
        <div
          className={styles.wrapper}
          role="none"
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          onClick={() => setIsOpen((o) => !o)}
        >
          <AccentPanel onlyRightBorder>
            <Amount
              value={total!}
              currency={baseCurrency}
              className={styles.amount}
              isApproximate
            />
          </AccentPanel>
          <QuickActions
            isOpen={isOpen}
            onEdit={() => navigate(`/${lang}/user/profile`)}
          />
        </div>
      )}
    </>
  );
};

export default TotalBalance;
