import type { Category, Transaction } from 'shared'
import type { CategoryIconName, Currency } from 'shared'
import Amount from '@/components/atoms/Amount/Amount'
import Icon from '@/components/atoms/Icon/Icon'
import styles from './TransactionItem.module.css'

interface TransactionItemProps {
  transaction: Transaction
  currency: Currency
  category?: Category
  onClick?: () => void
}

const TransactionItem = ({ transaction, currency, category, onClick }: TransactionItemProps) => {
  const date = new Date(transaction.date).toLocaleDateString()
  const signed = transaction.type === 'expense' ? -transaction.amount : transaction.amount

  const inner = (
    <>
      <div className={styles.info}>
        <span className={styles.description}>
          {transaction.description ?? transaction.category}
        </span>
        <span className={styles.date}>{date}</span>
      </div>
      {category && (
        <div className={styles.categoryCenter}>
          {category.icon && <Icon name={category.icon as CategoryIconName} className={styles.categoryIcon} />}
          <span className={styles.categoryName}>{category.name}</span>
        </div>
      )}
      <Amount value={signed} currency={currency} className={styles.amount} />
    </>
  )

  const bg = category
    ? `radial-gradient(ellipse at center, ${category.colour}40 0%, transparent 70%)`
    : undefined

  return (
    <li className={[styles.item, styles[transaction.type]].join(' ')}>
      {onClick ? (
        <button type="button" className={styles.button} style={{ background: bg }} onClick={onClick}>
          {inner}
        </button>
      ) : (
        <div className={styles.button} style={{ background: bg }}>{inner}</div>
      )}
    </li>
  )
}

export default TransactionItem
