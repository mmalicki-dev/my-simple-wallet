import type { Transaction } from '@/types'
import type { Currency } from 'shared'
import Amount from '@/components/atoms/Amount/Amount'
import styles from './TransactionItem.module.css'

interface TransactionItemProps {
  transaction: Transaction
  currency: Currency
  onClick?: () => void
}

const TransactionItem = ({ transaction, currency, onClick }: TransactionItemProps) => {
  const date = new Date(transaction.date).toLocaleDateString()
  const signed = transaction.type === 'expense' ? -transaction.amount : transaction.amount

  const content = (
    <>
      <div className={styles.info}>
        <span className={styles.description}>
          {transaction.description ?? transaction.category}
        </span>
        <span className={styles.date}>{date}</span>
      </div>
      <Amount value={signed} currency={currency} className={styles.amount} />
    </>
  )

  return (
    <li className={[styles.item, styles[transaction.type]].join(' ')}>
      {onClick ? (
        <button type="button" className={styles.button} onClick={onClick}>
          {content}
        </button>
      ) : content}
    </li>
  )
}

export default TransactionItem
