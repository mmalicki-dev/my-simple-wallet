import { Helmet } from "react-helmet";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useGetAccountsQuery } from "@/services/accountApi";
import AccountBlock from "@/components/organisms/AccountBlock/AccountBlock";
import RecurringPayments from "@/components/organisms/RecurringPayments/RecurringPayments";
import TotalBalance from "@/components/molecules/TotalBalance/TotalBalance";
import Spinner from "@/components/atoms/Spinner/Spinner";
import HudPanel from "@/components/templates/HudPanel/HudPanel";
import HomeRightPanel from "./HomeRightPanel";
import styles from "./HomePage.module.css";

const HomePage = () => {
  const { data: accounts = [], isLoading } = useGetAccountsQuery();
  const totalBalanceCurrency = useSelector(
    (state: RootState) => state.auth.user?.totalBalanceCurrency,
  );
  const [selectedAccountId, setSelectedAccountId] = useState<string | undefined>();

  useEffect(() => {
    if (selectedAccountId || accounts.length === 0) return;
    const def = accounts.find((a) => a.isDefault) ?? accounts[0];
    setSelectedAccountId(def._id);
  }, [accounts, selectedAccountId]);

  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <div className={styles.page}>
        {isLoading ? (
          <Spinner />
        ) : (
          <>
            <div className={styles.leftColumn}>
              {totalBalanceCurrency && (
                <HudPanel>
                  <TotalBalance
                    accounts={accounts}
                    baseCurrency={totalBalanceCurrency}
                  />
                </HudPanel>
              )}
              <HudPanel>
                <AccountBlock
                  selectedAccountId={selectedAccountId}
                  onSelectAccount={setSelectedAccountId}
                />
              </HudPanel>
              <RecurringPayments />
            </div>
            <div className={styles.rightColumn}>
              <HomeRightPanel accountId={selectedAccountId} />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default HomePage;
