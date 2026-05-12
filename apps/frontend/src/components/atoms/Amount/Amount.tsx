import type { Currency } from "shared";
import styles from "./Amount.module.css";

const CURRENCY_LOCALE: Record<string, string> = {
  NOK: "nb-NO",
  PLN: "pl-PL",
  EUR: "de-DE",
  USD: "en-US",
  GBP: "en-GB",
};

interface AmountProps {
  value: number;
  currency: Currency;
  className?: string;
  isApproximate?: boolean;
}

const Amount = ({
  value,
  currency,
  className,
  isApproximate = false,
}: AmountProps) => {
  const absFormatted = new Intl.NumberFormat(CURRENCY_LOCALE[currency], {
    style: "currency",
    currency,
    currencyDisplay: "symbol",
  }).format(Math.abs(value));
  const formatted = value < 0 ? `-${absFormatted}` : absFormatted;

  return (
    <span
      className={
        className ? `${styles.amount} ${className}` : `${styles.amount}`
      }
    >
      {isApproximate && "~"}
      {formatted}
    </span>
  );
};

export default Amount;
