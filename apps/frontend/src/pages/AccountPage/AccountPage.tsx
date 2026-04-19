import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import type { Account, Transaction } from '@/types'
import TransactionList from '@/components/organisms/TransactionList/TransactionList'
import BackButton from '@/components/molecules/BackButton/BackButton'
import Modal from '@/components/templates/Modal/Modal'
import EditTransactionForm from '@/components/organisms/EditTransactionForm/EditTransactionForm'
import styles from './AccountPage.module.css'

// TODO: replace with real API data
const MOCK_ACCOUNTS: Account[] = [
  { _id: 'acc1', user: 'user1', name: 'Main account', balance: 3240.5, currency: 'PLN', isDefault: true, createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { _id: 'acc2', user: 'user1', name: 'Savings', balance: 12800, currency: 'EUR', isDefault: false, createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { _id: 'acc3', user: 'user1', name: 'Travel fund', balance: 540, currency: 'NOK', isDefault: false, createdAt: '2026-01-01', updatedAt: '2026-01-01' },
]

const MOCK_TRANSACTIONS: Transaction[] = [
  { _id: 't1', account: 'acc1', amount: 2000, type: 'income', category: 'Salary', description: 'March salary', date: '2026-04-01', createdAt: '2026-04-01', updatedAt: '2026-04-01' },
  { _id: 't2', account: 'acc1', amount: 120, type: 'expense', category: 'Food', description: 'Weekly groceries', date: '2026-04-03', createdAt: '2026-04-03', updatedAt: '2026-04-03' },
  { _id: 't3', account: 'acc1', amount: 45, type: 'expense', category: 'Transport', description: 'Bus pass', date: '2026-04-05', createdAt: '2026-04-05', updatedAt: '2026-04-05' },
  { _id: 't4', account: 'acc1', amount: 350, type: 'expense', category: 'Rent', description: 'April rent', date: '2026-04-07', createdAt: '2026-04-07', updatedAt: '2026-04-07' },
  { _id: 't5', account: 'acc1', amount: 80, type: 'income', category: 'Freelance', description: 'Logo design', date: '2026-04-10', createdAt: '2026-04-10', updatedAt: '2026-04-10' },
  { _id: 't6', account: 'acc1', amount: 25, type: 'expense', category: 'Entertainment', description: 'Cinema tickets', date: '2026-04-12', createdAt: '2026-04-12', updatedAt: '2026-04-12' },

  { _id: 't7', account: 'acc2', amount: 5000, type: 'income', category: 'Bonus', description: 'Q1 bonus', date: '2026-04-01', createdAt: '2026-04-01', updatedAt: '2026-04-01' },
  { _id: 't8', account: 'acc2', amount: 200, type: 'expense', category: 'Shopping', description: 'New shoes', date: '2026-04-04', createdAt: '2026-04-04', updatedAt: '2026-04-04' },
  { _id: 't9', account: 'acc2', amount: 75, type: 'expense', category: 'Food', description: 'Restaurant dinner', date: '2026-04-06', createdAt: '2026-04-06', updatedAt: '2026-04-06' },
  { _id: 't10', account: 'acc2', amount: 1200, type: 'expense', category: 'Rent', description: 'April rent', date: '2026-04-08', createdAt: '2026-04-08', updatedAt: '2026-04-08' },
  { _id: 't11', account: 'acc2', amount: 300, type: 'income', category: 'Freelance', description: 'Consulting fee', date: '2026-04-11', createdAt: '2026-04-11', updatedAt: '2026-04-11' },
  { _id: 't12', account: 'acc2', amount: 60, type: 'expense', category: 'Entertainment', description: 'Concert tickets', date: '2026-04-14', createdAt: '2026-04-14', updatedAt: '2026-04-14' },

  { _id: 't13', account: 'acc3', amount: 800, type: 'income', category: 'Freelance', description: 'Travel blog payment', date: '2026-04-02', createdAt: '2026-04-02', updatedAt: '2026-04-02' },
  { _id: 't14', account: 'acc3', amount: 150, type: 'expense', category: 'Transport', description: 'Flight to Oslo', date: '2026-04-05', createdAt: '2026-04-05', updatedAt: '2026-04-05' },
  { _id: 't15', account: 'acc3', amount: 90, type: 'expense', category: 'Food', description: 'Airport lunch', date: '2026-04-05', createdAt: '2026-04-05', updatedAt: '2026-04-05' },
  { _id: 't16', account: 'acc3', amount: 400, type: 'expense', category: 'Hotel', description: 'Oslo hotel 2 nights', date: '2026-04-06', createdAt: '2026-04-06', updatedAt: '2026-04-06' },
  { _id: 't17', account: 'acc3', amount: 200, type: 'income', category: 'Refund', description: 'Flight refund', date: '2026-04-09', createdAt: '2026-04-09', updatedAt: '2026-04-09' },
  { _id: 't18', account: 'acc3', amount: 55, type: 'expense', category: 'Entertainment', description: 'Museum entry', date: '2026-04-11', createdAt: '2026-04-11', updatedAt: '2026-04-11' },
]

const AccountPage = () => {
  const { id } = useParams()
  const account = MOCK_ACCOUNTS.find((a) => a._id === id) ?? MOCK_ACCOUNTS[0]
  const transactions = MOCK_TRANSACTIONS.filter((t) => t.account === account._id)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

  return (
    <>
      <Helmet>
        <title>{account.name}</title>
      </Helmet>
      <Modal
        isOpen={!!selectedTransaction}
        onClose={() => setSelectedTransaction(null)}
        title="Edit transaction"
      >
        {selectedTransaction && (
          <EditTransactionForm
            transaction={selectedTransaction}
            onClose={() => setSelectedTransaction(null)}
            onDelete={() => {
              // TODO: call deleteTransaction mutation
              console.log('Delete transaction', selectedTransaction._id)
              setSelectedTransaction(null)
            }}
          />
        )}
      </Modal>
      <div className={styles.page}>
        <BackButton />
        <div className={styles.header}>
          <h1 className={styles.name}>{account.name}</h1>
          <span className={styles.balance}>
            {account.balance.toLocaleString()} {account.currency}
          </span>
        </div>
        <TransactionList
          transactions={transactions}
          currency={account.currency}
          onTransactionClick={setSelectedTransaction}
        />
      </div>
    </>
  )
}

export default AccountPage
