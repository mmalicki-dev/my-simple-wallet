import type { Currency } from 'shared'
import { useLanguage } from '@/hooks'
import styles from './Amount.module.css'

const LOCALE_MAP: Record<string, string> = {
  en: 'en-GB',
  pl: 'pl-PL',
  no: 'nb-NO',
}

interface AmountProps {
  value: number
  currency: Currency
  className?: string
}

const Amount = ({ value, currency, className }: AmountProps) => {
  const { language } = useLanguage()

  const formatted = new Intl.NumberFormat(LOCALE_MAP[language], {
    style: 'currency',
    currency,
    currencyDisplay: 'code',
  }).format(value)

  return (
    <span className={`${styles.amount}${className ? ` ${className}` : ''}`}>
      {formatted}
    </span>
  )
}

export default Amount
