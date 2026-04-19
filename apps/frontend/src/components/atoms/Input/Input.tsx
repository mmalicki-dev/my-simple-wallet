import type { InputHTMLAttributes } from 'react'
import styles from './Input.module.css'

type InputType = 'text' | 'email' | 'password' | 'date'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  type?: InputType
  error?: boolean
  className?: string
}

const Input = ({ type = 'text', error, className, ...rest }: InputProps) => {
  return (
    <input
      type={type}
      className={`${styles.input}${error ? ` ${styles.error}` : ''}${className ? ` ${className}` : ''}`}
      {...rest}
    />
  )
}

export default Input
