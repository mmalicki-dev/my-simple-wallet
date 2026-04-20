import { useState } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/redux/store'
import UserBlockWrapper from '@/components/molecules/UserBlockWrapper/UserBlockWrapper'
import Input from '@/components/atoms/Input/Input'
import Button from '@/components/atoms/Button/Button'
import { useRequestEmailChangeMutation } from '@/services/authApi'
import styles from './UserInfoBlock.module.css'

const UserInfoBlock = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const [name, setName] = useState(user?.name ?? '')
  const [newEmail, setNewEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)

  const [requestEmailChange, { isLoading }] = useRequestEmailChangeMutation()

  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault()
    await requestEmailChange({ email: newEmail }).unwrap()
    setEmailSent(true)
    setNewEmail('')
  }

  return (
    <UserBlockWrapper title="User Info">
      <div className={styles.field}>
        <label htmlFor="name" className={styles.label}>Name</label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <Button>Save</Button>
      <div className={styles.divider} />
      <div className={styles.field}>
        <label htmlFor="currentEmail" className={styles.label}>Current Email</label>
        <Input id="currentEmail" value={user?.email ?? ''} disabled />
      </div>
      <form onSubmit={handleEmailChange}>
        <div className={styles.field}>
          <label htmlFor="newEmail" className={styles.label}>New Email</label>
          <Input
            id="newEmail"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Enter new email address"
            required
          />
        </div>
        {emailSent && (
          <p className={styles.success}>Verification email sent. Check your inbox.</p>
        )}
        <Button type="submit" isLoading={isLoading}>Change Email</Button>
      </form>
    </UserBlockWrapper>
  )
}

export default UserInfoBlock
