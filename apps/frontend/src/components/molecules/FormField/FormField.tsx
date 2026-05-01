import { ReactNode } from 'react'
import styles from './FormField.module.css'

interface FormFieldProps {
  label: string
  htmlFor?: string
  children: ReactNode
  variant?: 'default' | 'neon'
}

const FormField = ({ label, htmlFor, children, variant = 'default' }: FormFieldProps) => {
  const isNeon = variant === 'neon'
  return (
    <div className={isNeon ? styles.fieldNeon : styles.field}>
      <label htmlFor={htmlFor} className={isNeon ? styles.labelNeon : styles.label}>
        {label}
      </label>
      {children}
    </div>
  )
}

export default FormField
