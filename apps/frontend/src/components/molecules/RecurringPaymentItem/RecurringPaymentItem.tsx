import type { RecurringPayment } from '@/types'
import styles from './RecurringPaymentItem.module.css'

interface RecurringPaymentItemProps {
  payment: RecurringPayment
}

const RecurringPaymentItem = ({ payment }: RecurringPaymentItemProps) => {
  const dueDate = new Date(payment.nextDueDate).toLocaleDateString()

  return (
    <li className={styles.item}>
      <div className={styles.info}>
        <span className={styles.name}>{payment.name}</span>
        <span className={styles.meta}>{payment.billingCycle} · due {dueDate}</span>
      </div>
      <span className={styles.amount}>{payment.amount}</span>
    </li>
  )
}

export default RecurringPaymentItem
