import type { ButtonHTMLAttributes } from 'react'
import type { IconName } from 'shared'
import Icon from '@/components/atoms/Icon/Icon'
import Spinner from '@/components/atoms/Spinner/Spinner'
import styles from './Button.module.css'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  icon?: IconName
  isLoading?: boolean
  className?: string
}

const Button = ({ variant = 'primary', icon, isLoading, className, children, disabled, ...rest }: ButtonProps) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]}${className ? ` ${className}` : ''}`}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? <Spinner /> : icon && <Icon name={icon} className={styles.icon} />}
      {children}
    </button>
  )
}

export default Button
