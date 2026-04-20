import { useState } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '@/redux/store'
import UserBlockWrapper from '@/components/molecules/UserBlockWrapper/UserBlockWrapper'
import Input from '@/components/atoms/Input/Input'
import Button from '@/components/atoms/Button/Button'
import styles from './UserInfoBlock.module.css'

const UserInfoBlock = () => {
  const user = useSelector((state: RootState) => state.auth.user)
  const [name, setName] = useState(user?.name ?? '')

  return (
    <UserBlockWrapper title="User Info">
      <div className={styles.field}>
        <label htmlFor="name" className={styles.label}>Name</label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>Email</label>
        <Input id="email" value={user?.email ?? ''} disabled />
      </div>
      <Button>Save</Button>
    </UserBlockWrapper>
  )
}

export default UserInfoBlock
