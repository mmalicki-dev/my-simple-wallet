import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import Logo from '@/components/atoms/Logo/Logo'
import AuthTabs from '@/components/molecules/AuthTabs/AuthTabs'
import AuthForm from '@/components/organisms/AuthForm/AuthForm'
import styles from './AuthPage.module.css'

type Mode = 'login' | 'register'

const AuthPage = () => {
  const { mode = 'login' } = useParams<{ mode: Mode }>()
  const authMode: Mode = mode === 'register' ? 'register' : 'login'

  return (
    <>
      <Helmet>
        <title>My Simple Wallet</title>
      </Helmet>
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.logoWrapper}>
            <Logo isFull />
          </div>
          <AuthTabs mode={authMode} />
          <AuthForm mode={authMode} />
        </div>
      </div>
    </>
  )
}

export default AuthPage
