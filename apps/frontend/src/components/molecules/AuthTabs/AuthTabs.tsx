import { useNavigate, useParams } from 'react-router-dom'
import Tabs from '@/components/molecules/Tabs/Tabs'
import styles from './AuthTabs.module.css'

type Mode = 'login' | 'register'

interface AuthTabsProps {
  mode: Mode
}

const TABS = ['sign in', 'register']

const AuthTabs = ({ mode }: AuthTabsProps) => {
  const { lang = 'en' } = useParams()
  const navigate = useNavigate()

  const handleTabChange = (tab: string) => {
    if (tab === 'sign in') navigate(`/${lang}/auth/login`)
    else navigate(`/${lang}/auth/register`)
  }

  return (
    <Tabs
      tabs={TABS}
      activeTab={mode === 'login' ? 'sign in' : 'register'}
      onTabChange={handleTabChange}
      containerClass={styles.tabs}
      itemClass={styles.tab}
      activeTabClass={styles.active}
    />
  )
}

export default AuthTabs
