import type { RecurringPayment, RecurringPaymentType } from '@/types'
import RecurringPaymentItem from '@/components/molecules/RecurringPaymentItem/RecurringPaymentItem'
import styles from './RecurringPaymentBlock.module.css'

interface RecurringPaymentBlockProps {
  type: RecurringPaymentType
  payments: RecurringPayment[]
}

const LABELS: Record<RecurringPaymentType, string> = {
  loan: 'Your loans',
  subscription: 'Your subscriptions',
}

const RecurringPaymentBlock = ({ type, payments }: RecurringPaymentBlockProps) => {
  return (
    <section className={styles.block}>
      <h2 className={styles.label}>{LABELS[type]}</h2>
      <ul className={styles.list}>
        {payments.map((payment) => (
          <RecurringPaymentItem key={payment._id} payment={payment} />
        ))}
      </ul>
    </section>
  )
}

export default RecurringPaymentBlock
