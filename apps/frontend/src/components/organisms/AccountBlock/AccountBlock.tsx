import { useNavigate, useParams, Link } from "react-router-dom";
import AccountItem from "@/components/molecules/AccountItem/AccountItem";
import Icon from "@/components/atoms/Icon/Icon";
import PanelLabel from "@/components/atoms/PanelLabel/PanelLabel";
import { useGetAccountsQuery } from "@/services";
import SkeletonLoader from "@/components/atoms/SkeletonLoader/SkeletonLoader";
import styles from "./AccountBlock.module.css";

const AccountBlock = () => {
  const { data: accounts = [], isLoading } = useGetAccountsQuery();
  const { lang = "en" } = useParams();
  const navigate = useNavigate();

  if (isLoading) return <SkeletonLoader count={3} />;

  if (accounts.length === 0) {
    return (
      <div className={styles.empty}>
        <Icon name="wallet" className={styles.emptyIcon} />
        <p className={styles.emptyText}>No accounts yet</p>
        <Link to={`/${lang}/user/accounts`} className={styles.emptyHint}>
          Go to settings to add your first account
        </Link>
      </div>
    );
  }

  return (
    <section className={styles.block}>
      <PanelLabel label="Your accounts" />
      <ul className={styles.list}>
        {accounts.map((account) => (
          <AccountItem
            key={account._id}
            account={account}
            onViewMore={() => navigate(`/${lang}/accounts/${account._id}`)}
            onEdit={() => navigate(`/${lang}/user/accounts`)}
          />
        ))}
      </ul>
    </section>
  );
};

export default AccountBlock;
