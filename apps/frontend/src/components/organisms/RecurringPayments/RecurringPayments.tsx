import type { RecurringPayment } from '@/types'
import RecurringPaymentBlock from '@/components/organisms/RecurringPaymentBlock/RecurringPaymentBlock'
import Spinner from '@/components/atoms/Spinner/Spinner'
import styles from './RecurringPayments.module.css'

// TODO: replace with useGetRecurringPaymentsQuery when backend is ready
const MOCK_DATA: RecurringPayment[] = [
  {
    _id: '1',
    account: 'acc1',
    category: 'cat1',
    name: 'Car loan',
    amount: 450,
    type: 'loan',
    billingCycle: 'monthly',
    nextDueDate: '2026-05-01',
    isActive: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    _id: '2',
    account: 'acc1',
    category: 'cat2',
    name: 'Mortgage',
    amount: 1200,
    type: 'loan',
    billingCycle: 'monthly',
    nextDueDate: '2026-05-05',
    isActive: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    _id: '3',
    account: 'acc1',
    category: 'cat3',
    name: 'Netflix',
    amount: 15,
    type: 'subscription',
    billingCycle: 'monthly',
    nextDueDate: '2026-04-22',
    isActive: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    _id: '4',
    account: 'acc1',
    category: 'cat3',
    name: 'Spotify',
    amount: 10,
    type: 'subscription',
    billingCycle: 'monthly',
    nextDueDate: '2026-04-25',
    isActive: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
]

const RecurringPayments = () => {
  const isLoading = false
  const data = MOCK_DATA

  const loans = data.filter((p) => p.type === 'loan')
  const subscriptions = data.filter((p) => p.type === 'subscription')

  if (isLoading) return <Spinner />
  if (loans.length === 0 && subscriptions.length === 0) return null

  return (
    <div className={styles.wrapper}>
      {loans.length > 0 && <RecurringPaymentBlock type="loan" payments={loans} />}
      {subscriptions.length > 0 && <RecurringPaymentBlock type="subscription" payments={subscriptions} />}
    </div>
  )
}

export default RecurringPayments
