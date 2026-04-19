import { Outlet, NavLink } from 'react-router-dom'
import styles from './Layout.module.css'

const Layout = () => {
  return (
    <div className={styles.layout}>
      <nav className={styles.nav}>
        <NavLink to="/">Home</NavLink>
      </nav>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout
