import { ReactNode } from 'react'
import styles from './UserBlockWrapper.module.css'

interface UserBlockWrapperProps {
  title: string
  children: ReactNode
}

const UserBlockWrapper = ({ title, children }: UserBlockWrapperProps) => {
  return (
    <section className={styles.block}>
      <h2 className={styles.title}>{title}</h2>
      {children}
    </section>
  )
}

export default UserBlockWrapper
