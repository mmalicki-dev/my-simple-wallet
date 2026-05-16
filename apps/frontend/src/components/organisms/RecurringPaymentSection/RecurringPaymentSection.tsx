import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
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
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    const editId = searchParams.get('edit')
    if (editId && payments.length > 0) {
      const payment = payments.find((p) => p._id === editId)
      if (payment) setSelected(payment)
    }
  }, [searchParams, payments])

  const handleCloseEdit = () => {
    setSelected(null)
    setSearchParams({}, { replace: true })
  }

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
        onClose={handleCloseEdit}
        title="Edit Recurring Payment"
      >
        {selected && (
          <RecurringPaymentForm payment={selected} onClose={handleCloseEdit} />
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
