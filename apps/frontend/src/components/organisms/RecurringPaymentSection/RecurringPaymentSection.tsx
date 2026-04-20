import { useState } from 'react'
import type { RecurringPayment } from '@/types'
import UserSectionList from '@/components/organisms/UserSectionList/UserSectionList'
import UserSectionItem from '@/components/molecules/UserSectionItem/UserSectionItem'
import EditRecurringPaymentForm from '@/components/organisms/EditRecurringPaymentForm/EditRecurringPaymentForm'
import Modal from '@/components/templates/Modal/Modal'
import Spinner from '@/components/atoms/Spinner/Spinner'
import { useGetRecurringPaymentsQuery } from '@/services/recurringPaymentApi'

const RecurringPaymentSection = () => {
  const { data: payments = [], isLoading } = useGetRecurringPaymentsQuery()
  const [selected, setSelected] = useState<RecurringPayment | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  if (isLoading) return <Spinner />

  const subscriptions = payments.filter((p) => p.type === 'subscription')
  const loans = payments.filter((p) => p.type === 'loan')

  const renderItem = (payment: RecurringPayment) => (
    <UserSectionItem
      key={payment._id}
      label={payment.name}
      subtitle={`${payment.amount.toLocaleString()} · ${payment.billingCycle}`}
      onEdit={() => setSelected(payment)}
    />
  )

  return (
    <>
      <Modal
        isOpen={isAdding}
        onClose={() => setIsAdding(false)}
        title="New Recurring Payment"
      >
        <EditRecurringPaymentForm onClose={() => setIsAdding(false)} />
      </Modal>
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title="Edit Recurring Payment"
      >
        {selected && (
          <EditRecurringPaymentForm payment={selected} onClose={() => setSelected(null)} />
        )}
      </Modal>
      <UserSectionList title="Subscriptions" onAdd={() => setIsAdding(true)}>
        {subscriptions.map(renderItem)}
      </UserSectionList>
      <UserSectionList title="Loans" onAdd={() => setIsAdding(true)}>
        {loans.map(renderItem)}
      </UserSectionList>
    </>
  )
}

export default RecurringPaymentSection
