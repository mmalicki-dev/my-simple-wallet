import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { useVerifyEmailMutation } from '@/services/authApi'
import styles from './VerifyEmailPage.module.css'

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [verifyEmail] = useVerifyEmailMutation()

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) {
      setStatus('error')
      return
    }
    verifyEmail({ token })
      .unwrap()
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [])

  return (
    <>
      <Helmet>
        <title>Verify Email</title>
      </Helmet>
      <div className={styles.page}>
        {status === 'loading' && <p className={styles.message}>Verifying your email...</p>}
        {status === 'success' && (
          <>
            <h1 className={styles.title}>Email verified!</h1>
            <p className={styles.message}>Your account is ready. You can now sign in.</p>
            <Link to="/auth/login" className={styles.link}>Go to Sign In</Link>
          </>
        )}
        {status === 'error' && (
          <>
            <h1 className={styles.title}>Verification failed</h1>
            <p className={styles.message}>The link is invalid or has expired.</p>
            <Link to="/auth/login" className={styles.link}>Go to Sign In</Link>
          </>
        )}
      </div>
    </>
  )
}

export default VerifyEmailPage
