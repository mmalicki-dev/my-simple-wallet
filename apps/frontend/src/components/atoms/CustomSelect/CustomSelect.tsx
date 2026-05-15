import { useEffect, useRef, useState } from 'react'
import styles from './CustomSelect.module.css'

export interface SelectOption {
  value: string
  label: string
}

interface CustomSelectProps {
  id?: string
  value: string
  options: SelectOption[]
  onChange: (value: string) => void
  placeholder?: string
}

const CustomSelect = ({ id, value, options, onChange, placeholder }: CustomSelectProps) => {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    if (!open) return
    const handleOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [open])

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        id={id}
        type="button"
        className={[styles.trigger, open ? styles.open : ''].join(' ')}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={selected ? '' : styles.placeholder}>
          {selected ? selected.label : (placeholder ?? 'Select…')}
        </span>
        <span className={[styles.chevron, open ? styles.chevronUp : ''].join(' ')}>▾</span>
      </button>
      {open && (
        <div className={styles.dropdown}>
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={[styles.option, opt.value === value ? styles.selected : ''].join(' ')}
              onClick={() => { onChange(opt.value); setOpen(false) }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default CustomSelect
