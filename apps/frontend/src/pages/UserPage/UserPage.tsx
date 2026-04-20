import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import UserTabs from '@/components/molecules/UserTabs/UserTabs'
import ProfileSection from '@/components/organisms/ProfileSection/ProfileSection'
import AccountSection from '@/components/organisms/AccountSection/AccountSection'
import RecurringPaymentSection from '@/components/organisms/RecurringPaymentSection/RecurringPaymentSection'
import CategorySection from '@/components/organisms/CategorySection/CategorySection'
import styles from './UserPage.module.css'

const UserPage = () => {
  const { tab = 'profile' } = useParams()

  return (
    <>
      <Helmet>
        <title>User</title>
      </Helmet>
      <div className={styles.page}>
        <UserTabs />
        {tab === 'profile' && <ProfileSection />}
        {tab === 'accounts' && <AccountSection />}
        {tab === 'recurring-payments' && <RecurringPaymentSection />}
        {tab === 'categories' && <CategorySection />}
      </div>
    </>
  )
}

export default UserPage
