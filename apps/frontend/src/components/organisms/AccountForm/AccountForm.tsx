import { useState } from 'react'
import { CURRENCIES } from 'shared'
import type { Account } from '@/types'
import Input from '@/components/atoms/Input/Input'
import SelectOption from '@/components/atoms/SelectOption/SelectOption'
import Checkbox from '@/components/atoms/Checkbox/Checkbox'
import FormActions from '@/components/molecules/FormActions/FormActions'
import { useCreateAccountMutation, useUpdateAccountMutation, useDeleteAccountMutation } from '@/services/accountApi'
import styles from './AccountForm.module.css'

interface AccountFormProps {
  account?: Account
  onClose: () => void
}

const CURRENCY_OPTIONS = CURRENCIES.map((c) => ({ value: c, label: c }))

const AccountForm = ({ account, onClose }: AccountFormProps) => {
  const [name, setName] = useState(account?.name ?? '')
  const [currency, setCurrency] = useState<Account['currency']>(account?.currency ?? 'PLN')
  const [isDefault, setIsDefault] = useState(account?.isDefault ?? false)

  const [createAccount] = useCreateAccountMutation()
  const [updateAccount] = useUpdateAccountMutation()
  const [deleteAccount] = useDeleteAccountMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (account) {
      await updateAccount({ id: account._id, body: { name, currency, isDefault } })
    } else {
      await createAccount({ name, currency })
    }
    onClose()
  }

  const handleDelete = async () => {
    if (!account) return
    await deleteAccount({ id: account._id })
    onClose()
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input
        type="text"
        placeholder="Account name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <SelectOption
        value={currency}
        options={CURRENCY_OPTIONS}
        onChange={(e) => setCurrency(e.target.value as Account['currency'])}
      />
      <Checkbox
        id="isDefault"
        label="Set as default account"
        checked={isDefault}
        onChange={(e) => setIsDefault(e.target.checked)}
      />
      <FormActions
        onCancel={onClose}
        onDelete={account ? handleDelete : undefined}
        submitLabel={account ? 'Save' : 'Create'}
      />
    </form>
  )
}

export default AccountForm
