import type { ButtonHTMLAttributes } from 'react'
import type { IconName } from 'shared'
import Icon from '@/components/atoms/Icon/Icon'
import styles from './Button.module.css'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  icon?: IconName
  className?: string
}

const Button = ({ variant = 'primary', icon, className, children, ...rest }: ButtonProps) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]}${className ? ` ${className}` : ''}`}
      {...rest}
    >
      {icon && <Icon name={icon} className={styles.icon} />}
      {children}
    </button>
  )
}

export default Button
