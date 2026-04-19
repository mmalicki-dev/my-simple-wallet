import type { SelectHTMLAttributes } from 'react'
import styles from './SelectOption.module.css'

interface Option {
  value: string
  label: string
}

interface SelectOptionProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[]
  error?: boolean
}

const SelectOption = ({ options, error, className, ...props }: SelectOptionProps) => {
  return (
    <select
      {...props}
      className={`${styles.select}${error ? ` ${styles.error}` : ''}${className ? ` ${className}` : ''}`}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}

export default SelectOption
