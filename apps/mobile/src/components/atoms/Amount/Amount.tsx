import { Text, type TextStyle, type StyleProp } from "react-native";
import type { Currency } from "shared";

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
  isApproximate?: boolean;
  style?: StyleProp<TextStyle>;
}

export const Amount = ({ value, currency, isApproximate = false, style }: AmountProps) => {
  const absFormatted = new Intl.NumberFormat(CURRENCY_LOCALE[currency] ?? "en-US", {
    style: "currency",
    currency,
    currencyDisplay: "symbol",
  }).format(Math.abs(value));
  const formatted = value < 0 ? `-${absFormatted}` : absFormatted;

  return (
    <Text style={style}>
      {isApproximate ? `~${formatted}` : formatted}
    </Text>
  );
};
