import { CATEGORY_ICON_NAMES } from 'shared'
import Icon from '@/components/atoms/Icon/Icon'
import styles from './IconPicker.module.css'

interface IconPickerProps {
  value: string
  onChange: (name: string) => void
}

const IconPicker = ({ value, onChange }: IconPickerProps) => {
  return (
    <div className={styles.grid}>
      {[...CATEGORY_ICON_NAMES].sort((a, b) => a.localeCompare(b)).map((name) => (
        <button
          key={name}
          type="button"
          className={[styles.tile, value === name ? styles.selected : ''].join(' ')}
          onClick={() => onChange(name)}
        >
          <Icon name={name} className={styles.icon} />
        </button>
      ))}
    </div>
  )
}

export default IconPicker
