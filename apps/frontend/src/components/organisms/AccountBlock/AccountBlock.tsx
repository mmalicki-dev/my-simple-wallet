import { useNavigate, useParams } from 'react-router-dom'
import type { Account } from '@/types'
import AccountItem from '@/components/molecules/AccountItem/AccountItem'
import styles from './AccountBlock.module.css'

interface AccountBlockProps {
  accounts: Account[]
}

const AccountBlock = ({ accounts }: AccountBlockProps) => {
  const { lang = 'en' } = useParams()
  const navigate = useNavigate()

  if (accounts.length === 0) return null

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
