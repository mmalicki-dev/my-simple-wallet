import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/atoms/Logo/Logo";
import NavItem from "@/components/molecules/NavItem/NavItem";
import { useLanguage } from "@/hooks";
import { logout } from "@/redux/slices/authSlice";
import { useLogoutMutation } from "@/services/authApi";
import styles from "./Navigation.module.css";

const Navigation = () => {
  const { language } = useLanguage();
  const base = `/${language}`;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutMutation] = useLogoutMutation();

  const handleLogout = async () => {
    await logoutMutation()
      .unwrap()
      .catch(() => {});
    dispatch(logout());
    navigate(`/${language}/auth/login`, { replace: true });
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <Logo isFull />
      </div>
      <ul className={styles.list}>
        <li className={styles.listItem}>
          <NavItem
            as="link"
            to={`${base}/home`}
            icon="dashboard"
            label="Home"
          />
        </li>
        <li className={styles.listItem}>
          <NavItem
            as="link"
            to={`${base}/charts`}
            icon="chart-bar-2"
            label="Charts"
          />
        </li>
        <li className={styles.listItem}>
          <NavItem as="link" to={`${base}/user`} icon="user-id" label="User" />
        </li>
        <li className={styles.listItem}>
          <NavItem
            as="button"
            onClick={handleLogout}
            icon="logout"
            label="Logout"
          />
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
