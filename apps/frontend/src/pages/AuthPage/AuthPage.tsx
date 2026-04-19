import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { useDispatch } from 'react-redux'
import Logo from '@/components/atoms/Logo/Logo'
import Input from '@/components/atoms/Input/Input'
import Button from '@/components/atoms/Button/Button'
import Checkbox from '@/components/atoms/Checkbox/Checkbox'
import { useLoginMutation, useRegisterMutation } from '@/services/authApi'
import { setCredentials } from '@/redux/slices/authSlice'
import styles from './AuthPage.module.css'

type Mode = 'login' | 'register'

const AuthPage = () => {
  const { lang = 'en' } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [mode, setMode] = useState<Mode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [login, { isLoading: isLoginLoading }] = useLoginMutation()
  const [register, { isLoading: isRegisterLoading }] = useRegisterMutation()

  const isLoading = isLoginLoading || isRegisterLoading

  const switchMode = (next: Mode) => {
    setMode(next)
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      if (mode === 'login') {
        const result = await login({ email, password, rememberMe }).unwrap()
        dispatch(setCredentials({ user: result.user, accessToken: result.accessToken }))
        navigate(`/${lang}/home`, { replace: true })
      } else {
        await register({ email, password, name }).unwrap()
        switchMode('login')
      }
    } catch {
      setError(mode === 'login' ? 'Invalid email or password.' : 'Registration failed. Try again.')
    }
  }

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

          <div className={styles.tabs}>
            <button
              type="button"
              className={[styles.tab, mode === 'login' ? styles.activeTab : ''].join(' ')}
              onClick={() => switchMode('login')}
            >
              Sign in
            </button>
            <button
              type="button"
              className={[styles.tab, mode === 'register' ? styles.activeTab : ''].join(' ')}
              onClick={() => switchMode('register')}
            >
              Register
            </button>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            {mode === 'register' && (
              <Input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            )}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
            {mode === 'login' && (
              <Checkbox
                id="rememberMe"
                label="Remember me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
            )}
            {error && <p className={styles.error}>{error}</p>}
            <Button type="submit" isLoading={isLoading}>
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}

export default AuthPage
