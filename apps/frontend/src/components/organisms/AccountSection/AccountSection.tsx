import { useState } from 'react'
import type { Account } from '@/types'
import UserSectionList from '@/components/organisms/UserSectionList/UserSectionList'
import UserSectionItem from '@/components/molecules/UserSectionItem/UserSectionItem'
import AccountForm from '@/components/organisms/AccountForm/AccountForm'
import Modal from '@/components/templates/Modal/Modal'
import Spinner from '@/components/atoms/Spinner/Spinner'
import { useGetAccountsQuery } from '@/services/accountApi'

const AccountSection = () => {
  const { data: accounts = [], isLoading } = useGetAccountsQuery()
  const [selected, setSelected] = useState<Account | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  if (isLoading) return <Spinner />

  return (
    <>
      <Modal
        isOpen={isAdding}
        onClose={() => setIsAdding(false)}
        title="New Account"
      >
        <AccountForm onClose={() => setIsAdding(false)} />
      </Modal>
      <Modal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title="Edit Account"
      >
        {selected && (
          <AccountForm account={selected} onClose={() => setSelected(null)} />
        )}
      </Modal>
      <UserSectionList title="Accounts" onAdd={() => setIsAdding(true)}>
        {accounts.map((account) => (
          <UserSectionItem
            key={account._id}
            label={account.name}
            subtitle={`${account.balance.toLocaleString()} ${account.currency}${account.isDefault ? ' · Default' : ''}`}
            onEdit={() => setSelected(account)}
          />
        ))}
      </UserSectionList>
    </>
  )
}

export default AccountSection
