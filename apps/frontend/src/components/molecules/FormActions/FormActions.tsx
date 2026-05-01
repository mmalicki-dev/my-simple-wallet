import Button from '@/components/atoms/Button/Button'
import styles from './FormActions.module.css'

interface FormActionsProps {
  onCancel: () => void
  onDelete?: () => void
  submitLabel?: string
  divider?: boolean
}

const FormActions = ({ onCancel, onDelete, submitLabel = 'Save', divider = false }: FormActionsProps) => (
  <div className={[styles.actions, divider ? styles.withDivider : ''].join(' ')}>
    {onDelete && (
      <Button type="button" variant="danger" onClick={onDelete}>
        Delete
      </Button>
    )}
    <div className={styles.right}>
      <Button type="button" variant="ghost" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit">{submitLabel}</Button>
    </div>
  </div>
)

export default FormActions
