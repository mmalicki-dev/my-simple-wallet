import { ReactNode } from 'react'
import styles from './UserSectionList.module.css'

interface UserSectionListProps {
  title: string
  onAdd?: () => void
  children: ReactNode
}

const UserSectionList = ({ title, onAdd, children }: UserSectionListProps) => {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {onAdd && (
          <button type="button" className={styles.addBtn} onClick={onAdd}>
            + Add
          </button>
        )}
      </div>
      <ul className={styles.list}>{children}</ul>
    </section>
  )
}

export default UserSectionList
