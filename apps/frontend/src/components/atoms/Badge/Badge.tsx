import type { TransactionType } from 'shared'
import styles from './Badge.module.css'

interface BadgeProps {
  type: TransactionType
  className?: string
}

const Badge = ({ type, className }: BadgeProps) => {
  return (
    <span className={`${styles.badge} ${styles[type]}${className ? ` ${className}` : ''}`}>
      {type === 'income' ? 'Income' : 'Expense'}
    </span>
  )
}

export default Badge
