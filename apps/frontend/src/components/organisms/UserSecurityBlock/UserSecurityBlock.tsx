import { useState } from 'react'
import UserBlockWrapper from '@/components/molecules/UserBlockWrapper/UserBlockWrapper'
import FormField from '@/components/molecules/FormField/FormField'
import PasswordInput from '@/components/molecules/PasswordInput/PasswordInput'
import HoloButton from '@/components/atoms/HoloButton/HoloButton'
import { useChangePasswordMutation } from '@/services/authApi'
import styles from './UserSecurityBlock.module.css'

const UserSecurityBlock = () => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [changePassword, { isLoading }] = useChangePasswordMutation()

  const handleSubmit = async () => {
    setError('')
    setSuccess('')

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }

    try {
      await changePassword({ oldPassword: currentPassword, newPassword }).unwrap()
      setSuccess('Password changed successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      setError(err?.data?.message ?? 'Something went wrong')
    }
  }

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
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}
      <HoloButton onClick={handleSubmit} isLoading={isLoading}>Change Password</HoloButton>
      <div className={styles.danger}>
        <HoloButton variant="danger">Delete Account</HoloButton>
      </div>
    </UserBlockWrapper>
  )
}

export default UserSecurityBlock
