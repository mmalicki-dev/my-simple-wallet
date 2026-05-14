import { useState } from 'react'
import type { RecurringPayment, RecurringPaymentType } from '@/types'
import UserSectionList from '@/components/organisms/UserSectionList/UserSectionList'
import UserSectionItem from '@/components/molecules/UserSectionItem/UserSectionItem'
import RecurringPaymentForm from '@/components/organisms/RecurringPaymentForm/RecurringPaymentForm'
import Modal from '@/components/templates/Modal/Modal'
import Spinner from '@/components/atoms/Spinner/Spinner'
import { useGetRecurringPaymentsQuery } from '@/services/recurringPaymentApi'

const RecurringPaymentSection = () => {
  const { data: payments = [], isLoading } = useGetRecurringPaymentsQuery()
  const [selected, setSelected] = useState<RecurringPayment | null>(null)
  const [addingType, setAddingType] = useState<RecurringPaymentType | null>(null)

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
        isOpen={!!addingType}
        onClose={() => setAddingType(null)}
        title="New Recurring Payment"
      >
        <RecurringPaymentForm defaultType={addingType ?? "subscription"} onClose={() => setAddingType(null)} />
      </Modal>
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title="Edit Recurring Payment"
      >
        {selected && (
          <RecurringPaymentForm payment={selected} onClose={() => setSelected(null)} />
        )}
      </Modal>
      <UserSectionList title="Subscriptions" onAdd={() => setAddingType("subscription")}>
        {subscriptions.map(renderItem)}
      </UserSectionList>
      <UserSectionList title="Loans" onAdd={() => setAddingType("loan")}>
        {loans.map(renderItem)}
      </UserSectionList>
    </>
  )
}

export default RecurringPaymentSection
