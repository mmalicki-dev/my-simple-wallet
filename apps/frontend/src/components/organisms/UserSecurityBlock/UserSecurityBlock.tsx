import { useState } from 'react'
import UserBlockWrapper from '@/components/molecules/UserBlockWrapper/UserBlockWrapper'
import Input from '@/components/atoms/Input/Input'
import Button from '@/components/atoms/Button/Button'
import styles from './UserSecurityBlock.module.css'

const UserSecurityBlock = () => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  return (
    <UserBlockWrapper title="Security">
      <div className={styles.field}>
        <label htmlFor="currentPassword" className={styles.label}>Current Password</label>
        <Input
          id="currentPassword"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="newPassword" className={styles.label}>New Password</label>
        <Input
          id="newPassword"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="confirmPassword" className={styles.label}>Confirm New Password</label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <Button>Change Password</Button>
      <div className={styles.danger}>
        <Button variant="danger">Delete Account</Button>
      </div>
    </UserBlockWrapper>
  )
}

export default UserSecurityBlock
