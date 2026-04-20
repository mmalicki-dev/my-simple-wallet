import styles from './UserSectionItem.module.css'

interface UserSectionItemProps {
  label: string
  subtitle?: string
  indicator?: string
  onEdit?: () => void
  onDelete?: () => void
}

const UserSectionItem = ({ label, subtitle, indicator, onEdit, onDelete }: UserSectionItemProps) => {
  return (
    <li className={styles.item}>
      {indicator && (
        <span className={styles.indicator} style={{ background: indicator }} />
      )}
      <div className={styles.content}>
        <span className={styles.label}>{label}</span>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </div>
      <div className={styles.actions}>
        {onEdit && (
          <button type="button" className={styles.actionBtn} onClick={onEdit}>
            Edit
          </button>
        )}
        {onDelete && (
          <button type="button" className={styles.actionBtn} onClick={onDelete}>
            Delete
          </button>
        )}
      </div>
    </li>
  )
}

export default UserSectionItem
