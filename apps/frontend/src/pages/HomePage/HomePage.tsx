import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { useGetAccountsQuery } from "@/services/accountApi";
import AccountBlock from "@/components/organisms/AccountBlock/AccountBlock";
import RecurringPayments from "@/components/organisms/RecurringPayments/RecurringPayments";
import TotalBalance from "@/components/molecules/TotalBalance/TotalBalance";
import Spinner from "@/components/atoms/Spinner/Spinner";
import styles from "./HomePage.module.css";

const HomePage = () => {
  const { data: accounts = [], isLoading } = useGetAccountsQuery();
  const totalBalanceCurrency = useSelector((state: RootState) => state.auth.user?.totalBalanceCurrency);


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
            {totalBalanceCurrency && (
              <TotalBalance
                accounts={accounts}
                baseCurrency={totalBalanceCurrency}
              />
            )}
            <AccountBlock accounts={accounts} />
            <RecurringPayments />
          </>
        )}
      </div>
    </>
  );
};

export default HomePage;
