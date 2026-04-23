import { useNavigate, useParams } from "react-router-dom";
import AccountItem from "@/components/molecules/AccountItem/AccountItem";
import styles from "./AccountBlock.module.css";
import PanelLabel from "@/components/atoms/PanelLabel/PanelLabel";
import { useGetAccountsQuery } from "@/services";

const AccountBlock = () => {
  const { data: accounts = [], isLoading } = useGetAccountsQuery();
  const { lang = "en" } = useParams();
  const navigate = useNavigate();

  if (accounts.length === 0) return null;

  return (
    <section className={styles.block}>
      <PanelLabel label="Your accounts" />
      <ul className={styles.list}>
        {accounts.map((account) => (
          <AccountItem
            isLoading={isLoading}
            key={account._id}
            account={account}
            onClick={() => navigate(`/${lang}/accounts/${account._id}`)}
          />
        ))}
      </ul>
    </section>
  );
};

export default AccountBlock;
