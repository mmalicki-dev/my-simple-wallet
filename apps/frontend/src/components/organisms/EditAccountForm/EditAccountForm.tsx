import { useState } from 'react'
import { CURRENCIES } from 'shared'
import type { Account } from '@/types'
import Input from '@/components/atoms/Input/Input'
import SelectOption from '@/components/atoms/SelectOption/SelectOption'
import Button from '@/components/atoms/Button/Button'
import styles from './EditAccountForm.module.css'

interface EditAccountFormProps {
  account: Account
  onClose: () => void
}

const CURRENCY_OPTIONS = CURRENCIES.map((c) => ({ value: c, label: c }))

const EditAccountForm = ({ account, onClose }: EditAccountFormProps) => {
  const [name, setName] = useState(account.name)
  const [currency, setCurrency] = useState(account.currency)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: call updateAccount mutation
    console.log('Update account', { name, currency })
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
      <div className={styles.actions}>
        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
        <Button type="submit">Save</Button>
      </div>
    </form>
  )
}

export default EditAccountForm
