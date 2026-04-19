import { useState } from 'react'
import type { RecurringPayment, RecurringPaymentType } from '@/types'
import RecurringPaymentItem from '@/components/molecules/RecurringPaymentItem/RecurringPaymentItem'
import styles from './RecurringPaymentBlock.module.css'

const PREVIEW_COUNT = 2

interface RecurringPaymentBlockProps {
  type: RecurringPaymentType
  payments: RecurringPayment[]
  onItemClick: (payment: RecurringPayment) => void
}

const LABELS: Record<RecurringPaymentType, string> = {
  loan: 'Your loans',
  subscription: 'Your subscriptions',
}

const RecurringPaymentBlock = ({ type, payments, onItemClick }: RecurringPaymentBlockProps) => {
  const [expanded, setExpanded] = useState(false)

  const hasMore = payments.length > PREVIEW_COUNT
  const visible = expanded ? payments : payments.slice(0, PREVIEW_COUNT)

  return (
    <section className={styles.block}>
      <h2 className={styles.label}>{LABELS[type]}</h2>
      <ul className={styles.list}>
        {visible.map((payment) => (
          <RecurringPaymentItem key={payment._id} payment={payment} onClick={() => onItemClick(payment)} />
        ))}
      </ul>
      {hasMore && (
        <button
          type="button"
          className={styles.expandButton}
          onClick={() => setExpanded((prev) => !prev)}
        >
          {expanded ? 'Show less' : '···'}
        </button>
      )}
    </section>
  )
}

export default RecurringPaymentBlock
