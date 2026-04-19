import { Helmet } from 'react-helmet'
import AccountBlock from '@/components/organisms/AccountBlock/AccountBlock'
import RecurringPayments from '@/components/organisms/RecurringPayments/RecurringPayments'
import TotalBalance from '@/components/molecules/TotalBalance/TotalBalance'
import type { Account } from '@/types'
import styles from './HomePage.module.css'

// TODO: replace with real accounts from API
const MOCK_ACCOUNTS: Account[] = [
  { _id: 'acc1', user: 'user1', name: 'Main account', balance: 3240.5, currency: 'PLN', isDefault: true, createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { _id: 'acc2', user: 'user1', name: 'Savings', balance: 12800, currency: 'EUR', isDefault: false, createdAt: '2026-01-01', updatedAt: '2026-01-01' },
  { _id: 'acc3', user: 'user1', name: 'Travel fund', balance: 540, currency: 'NOK', isDefault: false, createdAt: '2026-01-01', updatedAt: '2026-01-01' },
]

const baseCurrency = MOCK_ACCOUNTS.find((a) => a.isDefault)?.currency ?? 'PLN'

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <div className={styles.page}>
        <TotalBalance accounts={MOCK_ACCOUNTS} baseCurrency={baseCurrency} />
        <AccountBlock />
        <RecurringPayments />
      </div>
    </>
  )
}

export default HomePage
