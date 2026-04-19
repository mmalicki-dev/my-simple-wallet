import type { Transaction } from '@/types'
import type { Currency } from 'shared'
import TransactionItem from '@/components/molecules/TransactionItem/TransactionItem'
import Spinner from '@/components/atoms/Spinner/Spinner'
import styles from './TransactionList.module.css'

interface TransactionListProps {
  transactions: Transaction[]
  currency: Currency
  isLoading?: boolean
  onTransactionClick?: (transaction: Transaction) => void
}

const getMonthLabel = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en', { month: 'long', year: 'numeric' })

const groupByMonth = (transactions: Transaction[]): [string, Transaction[]][] => {
  const sorted = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const map = new Map<string, Transaction[]>()
  for (const t of sorted) {
    const key = getMonthLabel(t.date)
    if (!map.has(key)) map.set(key, [])
    map.get(key)?.push(t)
  }

  return [...map.entries()]
}

const TransactionList = ({ transactions, currency, isLoading, onTransactionClick }: TransactionListProps) => {
  if (isLoading) return <Spinner />
  if (transactions.length === 0) return <p className={styles.empty}>No transactions yet.</p>

  const groups = groupByMonth(transactions)

  return (
    <div className={styles.wrapper}>
      {groups.map(([month, items]) => (
        <section key={month}>
          <h3 className={styles.monthLabel}>{month}</h3>
          <ul className={styles.list}>
            {items.map((t) => (
              <TransactionItem
                key={t._id}
                transaction={t}
                currency={currency}
                onClick={onTransactionClick ? () => onTransactionClick(t) : undefined}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

export default TransactionList
