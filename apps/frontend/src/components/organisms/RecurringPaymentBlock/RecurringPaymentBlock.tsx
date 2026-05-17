import { useSelector } from "react-redux";
import type {
  BillingCycle,
  RecurringPayment,
  RecurringPaymentType,
} from "@/types";
import { useGetAccountsQuery } from "@/services/accountApi";
import { useGetExchangeRatesQuery } from "@/services/exchangeRateApi";
import { useGetRecurringPaymentsQuery } from "@/services";
import type { RootState } from "@/redux/store";
import RecurringPaymentItem from "@/components/molecules/RecurringPaymentItem/RecurringPaymentItem";
import PanelLabel from "@/components/atoms/PanelLabel/PanelLabel";
import Amount from "@/components/atoms/Amount/Amount";
import SkeletonLoader from "@/components/atoms/SkeletonLoader/SkeletonLoader";
import styles from "./RecurringPaymentBlock.module.css";

const MONTHLY_FACTOR: Record<BillingCycle, number> = {
  weekly: 52 / 12,
  monthly: 1,
  yearly: 1 / 12,
};

interface RecurringPaymentBlockProps {
  type: RecurringPaymentType;
  payments: RecurringPayment[];
  onItemClick: (payment: RecurringPayment) => void;
}

const LABELS: Record<RecurringPaymentType, string> = {
  loan: "Your loans",
  subscription: "Your subscriptions",
};

const RecurringPaymentBlock = ({
  type,
  payments,
  onItemClick,
}: RecurringPaymentBlockProps) => {
  const { isLoading: paymentsLoading } = useGetRecurringPaymentsQuery();
  const { data: accounts = [], isLoading: accountsLoading } =
    useGetAccountsQuery();
  const baseCurrency = useSelector(
    (state: RootState) => state.auth.user?.totalBalanceCurrency,
  );

  const active = payments.filter((p) => p.isActive);
  const activeCurrencies = [
    ...new Set(
      active.map(
        (p) => accounts.find((a) => a._id === p.account)?.currency ?? "USD",
      ),
    ),
  ];
  const allSameCurrency =
    activeCurrencies.length === 1 && activeCurrencies[0] === baseCurrency;

  const { data: ratesData, isLoading: ratesLoading } = useGetExchangeRatesQuery(
    baseCurrency ?? "USD",
    { skip: !baseCurrency || allSameCurrency || active.length === 0 },
  );

  if (paymentsLoading || accountsLoading) return <SkeletonLoader count={2} />;

  const displayCurrency = baseCurrency ?? activeCurrencies[0] ?? "USD";

  const monthlyTotal = active.reduce((sum, p) => {
    const monthly = p.amount * MONTHLY_FACTOR[p.billingCycle];
    const currency =
      accounts.find((a) => a._id === p.account)?.currency ?? "USD";
    if (currency === displayCurrency) return sum + monthly;
    const rate = ratesData?.rates[currency];
    return rate ? sum + monthly / rate : sum + monthly;
  }, 0);

  return (
    <section className={styles.block}>
      <PanelLabel label={LABELS[type]} />
      {active.length > 0 && !ratesLoading && (
        <PanelLabel side="right" className={styles.negative}>
          <Amount value={-monthlyTotal} currency={displayCurrency} />
          <span className={styles.period}>/mo</span>
        </PanelLabel>
      )}
      <ul className={styles.list}>
        {payments.map((payment) => (
          <RecurringPaymentItem
            key={payment._id}
            payment={payment}
            currency={
              accounts.find((a) => a._id === payment.account)?.currency ?? "USD"
            }
            accountName={
              accounts.find((a) => a._id === payment.account)?.name ?? "unknown"
            }
            onEdit={() => onItemClick(payment)}
          />
        ))}
      </ul>
    </section>
  );
};

export default RecurringPaymentBlock;
