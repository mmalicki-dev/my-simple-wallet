import { Outlet } from "react-router-dom";
import Navigation from "@/components/organisms/Navigation/Navigation";
import styles from "./Layout.module.css";

const Layout = () => {
  return (
    <div className={styles.layout}>
      <main className={styles.main}>
        <Outlet />
      </main>
      <Navigation />
    </div>
  );
};

export default Layout;
