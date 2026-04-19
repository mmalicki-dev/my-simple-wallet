import { Outlet } from 'react-router-dom'
import Navigation from '@/components/organisms/Navigation/Navigation'
import styles from './Layout.module.css'

const Layout = () => {
  return (
    <div className={styles.layout}>
      <Navigation />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
