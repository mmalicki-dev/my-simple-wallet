import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { useConfirmEmailChangeMutation } from '@/services/authApi'
import styles from './ConfirmEmailChangePage.module.css'

const ConfirmEmailChangePage = () => {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [confirmEmailChange] = useConfirmEmailChangeMutation()

  useEffect(() => {
    const token = searchParams.get('token')
    if (!token) {
      setStatus('error')
      return
    }
    confirmEmailChange({ token })
      .unwrap()
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [])

  return (
    <>
      <Helmet>
        <title>Confirm Email Change</title>
      </Helmet>
      <div className={styles.page}>
        {status === 'loading' && <p className={styles.message}>Confirming your new email...</p>}
        {status === 'success' && (
          <>
            <h1 className={styles.title}>Email updated!</h1>
            <p className={styles.message}>Your email address has been changed successfully.</p>
            <Link to="/auth/login" className={styles.link}>Sign in with your new email</Link>
          </>
        )}
        {status === 'error' && (
          <>
            <h1 className={styles.title}>Confirmation failed</h1>
            <p className={styles.message}>The link is invalid or has expired.</p>
            <Link to="/auth/login" className={styles.link}>Go to Sign In</Link>
          </>
        )}
      </div>
    </>
  )
}

export default ConfirmEmailChangePage
