import { useState } from 'react'
import { CURRENCIES } from 'shared'
import type { Account } from '@/types'
import Input from '@/components/atoms/Input/Input'
import SelectOption from '@/components/atoms/SelectOption/SelectOption'
import Checkbox from '@/components/atoms/Checkbox/Checkbox'
import Button from '@/components/atoms/Button/Button'
import { useCreateAccountMutation, useUpdateAccountMutation, useDeleteAccountMutation } from '@/services/accountApi'
import styles from './EditAccountForm.module.css'

interface EditAccountFormProps {
  account?: Account
  onClose: () => void
}

const CURRENCY_OPTIONS = CURRENCIES.map((c) => ({ value: c, label: c }))

const EditAccountForm = ({ account, onClose }: EditAccountFormProps) => {
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
      <div className={styles.actions}>
        {account && (
          <Button type="button" variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        )}
        <div className={styles.right}>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{account ? 'Save' : 'Create'}</Button>
        </div>
      </div>
    </form>
  )
}

export default EditAccountForm
