import { useState } from 'react'
import UserBlockWrapper from '@/components/molecules/UserBlockWrapper/UserBlockWrapper'
import FormField from '@/components/molecules/FormField/FormField'
import PasswordInput from '@/components/molecules/PasswordInput/PasswordInput'
import HoloButton from '@/components/atoms/HoloButton/HoloButton'
import styles from './UserSecurityBlock.module.css'

const UserSecurityBlock = () => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  return (
    <UserBlockWrapper title="Security">
      <FormField label="Current Password" htmlFor="currentPassword">
        <PasswordInput
          id="currentPassword"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </FormField>
      <FormField label="New Password" htmlFor="newPassword">
        <PasswordInput
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </FormField>
      <FormField label="Confirm New Password" htmlFor="confirmPassword">
        <PasswordInput
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </FormField>
      <HoloButton>Change Password</HoloButton>
      <div className={styles.danger}>
        <HoloButton variant="danger">Delete Account</HoloButton>
      </div>
    </UserBlockWrapper>
  )
}

export default UserSecurityBlock
