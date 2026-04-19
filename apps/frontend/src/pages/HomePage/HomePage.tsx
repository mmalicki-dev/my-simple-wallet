import { Helmet } from 'react-helmet'
import RecurringPayments from '@/components/organisms/RecurringPayments/RecurringPayments'

const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <RecurringPayments />
    </>
  )
}

export default HomePage
