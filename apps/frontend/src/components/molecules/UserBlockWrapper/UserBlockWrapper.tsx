import { ReactNode } from 'react'
import styles from './UserBlockWrapper.module.css'

interface UserBlockWrapperProps {
  title: string
  children: ReactNode
  id?: string
}

const UserBlockWrapper = ({ title, children, id }: UserBlockWrapperProps) => {
  return (
    <section id={id} className={styles.block}>
      <h2 className={styles.title}>{title}</h2>
      {children}
    </section>
  )
}

export default UserBlockWrapper
