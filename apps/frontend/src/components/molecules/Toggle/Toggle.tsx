import styles from './Toggle.module.css'

interface ToggleOption {
  value: string
  label: string
}

interface ToggleProps {
  options: ToggleOption[]
  value: string
  onChange: (value: string) => void
}

const Toggle = ({ options, value, onChange }: ToggleProps) => {
  return (
    <div className={styles.toggle}>
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={[styles.btn, value === opt.value ? styles.active : ''].join(' ')}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export default Toggle
