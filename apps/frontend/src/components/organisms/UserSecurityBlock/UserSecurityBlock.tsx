import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import UserBlockWrapper from '@/components/molecules/UserBlockWrapper/UserBlockWrapper'
import FormField from '@/components/molecules/FormField/FormField'
import PasswordInput from '@/components/molecules/PasswordInput/PasswordInput'
import HoloButton from '@/components/atoms/HoloButton/HoloButton'
import Modal from '@/components/templates/Modal/Modal'
import { useChangePasswordMutation, useDeleteUserMutation } from '@/services/authApi'
import { logout } from '@/redux/slices/authSlice'
import styles from './UserSecurityBlock.module.css'

const UserSecurityBlock = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleteError, setDeleteError] = useState('')

  const [changePassword, { isLoading: isChanging }] = useChangePasswordMutation()
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation()

  const handleChangePassword = async () => {
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

  const handleDeleteAccount = async () => {
    setDeleteError('')
    try {
      await deleteUser({ password: deletePassword }).unwrap()
      dispatch(logout())
      navigate('/login')
    } catch (err: any) {
      setDeleteError(err?.data?.message ?? 'Something went wrong')
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
      <HoloButton onClick={handleChangePassword} isLoading={isChanging}>Change Password</HoloButton>

      <div className={styles.danger}>
        <HoloButton variant="danger" onClick={() => setDeleteModalOpen(true)}>Delete Account</HoloButton>
      </div>

      <Modal isOpen={deleteModalOpen} onClose={() => { setDeleteModalOpen(false); setDeletePassword(''); setDeleteError('') }} title="Delete Account">
        <p className={styles.deleteWarning}>This will permanently delete your account and all your data. This cannot be undone.</p>
        <FormField label="Enter your password to confirm" htmlFor="deletePassword">
          <PasswordInput
            id="deletePassword"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
          />
        </FormField>
        {deleteError && <p className={styles.error}>{deleteError}</p>}
        <HoloButton variant="danger" onClick={handleDeleteAccount} isLoading={isDeleting}>
          Permanently Delete Account
        </HoloButton>
      </Modal>
    </UserBlockWrapper>
  )
}

export default UserSecurityBlock
