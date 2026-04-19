import { useState } from 'react'
import type { TransactionType } from 'shared'
import type { Transaction } from '@/types'
import Input from '@/components/atoms/Input/Input'
import Button from '@/components/atoms/Button/Button'
import styles from './EditTransactionForm.module.css'

interface EditTransactionFormProps {
  transaction: Transaction
  onClose: () => void
  onDelete: () => void
}

const EditTransactionForm = ({ transaction, onClose, onDelete }: EditTransactionFormProps) => {
  const [type, setType] = useState<TransactionType>(transaction.type)
  const [amount, setAmount] = useState(String(transaction.amount))
  const [category, setCategory] = useState(transaction.category)
  const [description, setDescription] = useState(transaction.description ?? '')
  const [date, setDate] = useState(transaction.date.slice(0, 10))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: call updateTransaction mutation
    console.log('Update transaction', { type, amount: Number(amount), category, description, date })
    onClose()
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.typeToggle}>
        <button
          type="button"
          className={[styles.typeBtn, type === 'income' ? styles.income : ''].join(' ')}
          onClick={() => setType('income')}
        >
          Income
        </button>
        <button
          type="button"
          className={[styles.typeBtn, type === 'expense' ? styles.expense : ''].join(' ')}
          onClick={() => setType('expense')}
        >
          Expense
        </button>
      </div>
      <Input
        type="text"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        inputMode="decimal"
        required
      />
      <Input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
      />
      <Input
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <div className={styles.actions}>
        <Button type="button" variant="danger" onClick={onDelete}>Delete</Button>
        <div className={styles.right}>
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit">Save</Button>
        </div>
      </div>
    </form>
  )
}

export default EditTransactionForm
