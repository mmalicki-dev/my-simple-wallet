import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/atoms/Logo/Logo";
import NavItem from "@/components/molecules/NavItem/NavItem";
import Icon from "@/components/atoms/Icon/Icon";
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
    await logoutMutation().unwrap().catch(() => {});
    dispatch(logout());
    navigate(`/${language}/auth/login`, { replace: true });
  };

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
        <li>
          <button type="button" className={styles.logoutBtn} onClick={handleLogout}>
            <Icon name="minus-circle" className={styles.logoutIcon} />
            <span className={styles.logoutLabel}>Logout</span>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
