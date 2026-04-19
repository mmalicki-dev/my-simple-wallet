import Logo from "@/components/atoms/Logo/Logo";
import NavItem from "@/components/molecules/NavItem/NavItem";
import { useLanguage } from "@/hooks";
import styles from "./Navigation.module.css";

const Navigation = () => {
  const { language } = useLanguage();
  const base = `/${language}`;

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <Logo isFull />
      </div>
      <ul className={styles.list}>
        <li>
          <NavItem to={`${base}/home`} icon="home" label="Home" />
        </li>
        <li>
          <NavItem to={`${base}/charts`} icon="trending-up" label="Charts" />
        </li>
        <li>
          <NavItem to={`${base}/user`} icon="briefcase" label="User" />
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
