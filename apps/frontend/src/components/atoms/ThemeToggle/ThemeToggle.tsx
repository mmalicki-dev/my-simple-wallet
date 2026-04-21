import { useContext } from 'react'
import { ThemeContext } from '@/context'
import styles from './ThemeToggle.module.css'

const ThemeToggle = () => {
  const themeCtx = useContext(ThemeContext)

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={themeCtx?.toggleTheme}
      aria-label="Toggle theme"
    >
      <span className={[styles.track, themeCtx?.theme === 'dark' ? styles.dark : ''].join(' ')}>
        <span className={styles.thumb} />
      </span>
      <span className={styles.label}>
        {themeCtx?.theme === 'dark' ? 'Dark' : 'Light'}
      </span>
    </button>
  )
}

export default ThemeToggle
