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
          <NavItem to={`${base}/accounts`} icon="briefcase" label="Accounts" />
        </li>
        <li>
          <NavItem
            to={`${base}/categories`}
            icon="shopping-bag"
            label="Categories"
          />
        </li>
        <li>
          <NavItem to={`${base}/recurring`} icon="repeat" label="Recurring" />
        </li>
        <li>
          <NavItem to={`${base}/options`} icon="utensils" label="Options" />
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
