import { Helmet } from "react-helmet";
import { useGetAccountsQuery } from "@/services/accountApi";
import AccountBlock from "@/components/organisms/AccountBlock/AccountBlock";
import RecurringPayments from "@/components/organisms/RecurringPayments/RecurringPayments";
import TotalBalance from "@/components/molecules/TotalBalance/TotalBalance";
import Spinner from "@/components/atoms/Spinner/Spinner";
import styles from "./HomePage.module.css";

const HomePage = () => {
  const { data: accounts = [], isLoading } = useGetAccountsQuery();
  const defaultAccount = accounts.find((a) => a.isDefault) ?? accounts[0];

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
            {defaultAccount && (
              <TotalBalance
                accounts={accounts}
                baseCurrency={defaultAccount.currency}
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
