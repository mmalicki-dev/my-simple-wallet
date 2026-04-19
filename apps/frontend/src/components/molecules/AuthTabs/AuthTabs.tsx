import { useNavigate, useParams } from 'react-router-dom'
import styles from './AuthTabs.module.css'

type Mode = 'login' | 'register'

interface AuthTabsProps {
  mode: Mode
}

const AuthTabs = ({ mode }: AuthTabsProps) => {
  const { lang = 'en' } = useParams()
  const navigate = useNavigate()

  return (
    <div className={styles.tabs}>
      <button
        type="button"
        className={[styles.tab, mode === 'login' ? styles.active : ''].join(' ')}
        onClick={() => navigate(`/${lang}/auth/login`)}
      >
        Sign in
      </button>
      <button
        type="button"
        className={[styles.tab, mode === 'register' ? styles.active : ''].join(' ')}
        onClick={() => navigate(`/${lang}/auth/register`)}
      >
        Register
      </button>
    </div>
  )
}

export default AuthTabs
