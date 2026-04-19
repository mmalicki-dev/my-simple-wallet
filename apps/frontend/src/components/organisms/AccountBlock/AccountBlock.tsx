import { useNavigate, useParams } from 'react-router-dom'
import { useGetAccountsQuery } from '@/services/accountApi'
import AccountItem from '@/components/molecules/AccountItem/AccountItem'
import Spinner from '@/components/atoms/Spinner/Spinner'
import styles from './AccountBlock.module.css'

const AccountBlock = () => {
  const { lang = 'en' } = useParams()
  const navigate = useNavigate()
  const { data: accounts = [], isLoading } = useGetAccountsQuery()

  if (isLoading) return <Spinner />
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
