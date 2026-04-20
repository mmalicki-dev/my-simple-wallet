import { useNavigate, useParams } from 'react-router-dom'
import Tabs from '@/components/molecules/Tabs/Tabs'
import styles from './UserTabs.module.css'

const TABS = ['profile', 'accounts', 'recurring payments', 'categories']

const TAB_TO_PATH: Record<string, string> = {
  'profile': 'profile',
  'accounts': 'accounts',
  'recurring payments': 'recurring-payments',
  'categories': 'categories',
}

const PATH_TO_TAB: Record<string, string> = {
  'profile': 'profile',
  'accounts': 'accounts',
  'recurring-payments': 'recurring payments',
  'categories': 'categories',
}

const UserTabs = () => {
  const { lang = 'en', tab = 'profile' } = useParams()
  const navigate = useNavigate()

  const handleTabChange = (selected: string) => {
    navigate(`/${lang}/user/${TAB_TO_PATH[selected]}`)
  }

  return (
    <Tabs
      tabs={TABS}
      activeTab={PATH_TO_TAB[tab] ?? 'profile'}
      onTabChange={handleTabChange}
      containerClass={styles.tabs}
      itemClass={styles.tab}
      activeTabClass={styles.active}
    />
  )
}

export default UserTabs
