import { useNavigate, useParams } from 'react-router-dom'
import type { Account } from '@/types'
import AccountItem from '@/components/molecules/AccountItem/AccountItem'
import Spinner from '@/components/atoms/Spinner/Spinner'
import styles from './AccountBlock.module.css'

// TODO: replace with useGetAccountsQuery when backend is ready
const MOCK_DATA: Account[] = [
  {
    _id: 'acc1',
    user: 'user1',
    name: 'Main account',
    balance: 3240.5,
    currency: 'PLN',
    isDefault: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    _id: 'acc2',
    user: 'user1',
    name: 'Savings',
    balance: 12800,
    currency: 'EUR',
    isDefault: false,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    _id: 'acc3',
    user: 'user1',
    name: 'Travel fund',
    balance: 540,
    currency: 'NOK',
    isDefault: false,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
]

const AccountBlock = () => {
  const { lang = 'en' } = useParams()
  const navigate = useNavigate()
  const isLoading = false
  const accounts = MOCK_DATA

  if (isLoading) return <Spinner />

  return (
    <section className={styles.block}>
      <h2 className={styles.label}>Your accounts</h2>
      <ul className={styles.list}>
        {accounts.map((account) => (
          <AccountItem
            key={account._id}
            account={account}
            onClick={() => navigate(`/${lang}/accounts/${account._id}`)}
          />
        ))}
      </ul>
    </section>
  )
}

export default AccountBlock
