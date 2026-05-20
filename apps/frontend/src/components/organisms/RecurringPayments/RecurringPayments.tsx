import { Link, useNavigate, useParams } from "react-router-dom";
import type { RecurringPayment, RecurringPaymentType } from "shared";
import { useGetRecurringPaymentsQuery } from "@/services/recurringPaymentApi";
import RecurringPaymentBlock from "@/components/organisms/RecurringPaymentBlock/RecurringPaymentBlock";
import Spinner from "@/components/atoms/Spinner/Spinner";
import Icon from "@/components/atoms/Icon/Icon";
import HudPanel from "@/components/templates/HudPanel/HudPanel";
import styles from "./RecurringPayments.module.css";

interface SectionProps {
  type: RecurringPaymentType;
  payments: RecurringPayment[];
  onSelect: (payment: RecurringPayment) => void;
}

const RecurringPaymentSection = ({ type, payments, onSelect }: SectionProps) => (
  <HudPanel>
    <RecurringPaymentBlock type={type} payments={payments} onItemClick={onSelect} />
  </HudPanel>
);

const RecurringPayments = () => {
  const { data = [], isLoading } = useGetRecurringPaymentsQuery();
  const { lang = "en" } = useParams();
  const navigate = useNavigate();

  const loans = data.filter((p) => p.type === "loan");
  const subscriptions = data.filter((p) => p.type === "subscription");

  const handleSelect = (payment: RecurringPayment) =>
    navigate(`/${lang}/user/recurring-payments?edit=${payment._id}`);

  if (isLoading) return <Spinner />;

  if (loans.length === 0 && subscriptions.length === 0) {
    return (
      <HudPanel>
        <div className={styles.empty}>
          <Icon name="repeat" className={styles.emptyIcon} />
          <p className={styles.emptyText}>No recurring payments yet</p>
          <Link to={`/${lang}/user/recurring-payments`} className={styles.emptyLink}>
            Add subscriptions or loans
          </Link>
        </div>
      </HudPanel>
    );
  }

  return (
    <>
      {loans.length > 0 && (
        <RecurringPaymentSection type="loan" payments={loans} onSelect={handleSelect} />
      )}
      {subscriptions.length > 0 && (
        <RecurringPaymentSection type="subscription" payments={subscriptions} onSelect={handleSelect} />
      )}
    </>
  );
};

export default RecurringPayments;
