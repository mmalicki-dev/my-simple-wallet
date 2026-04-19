import { NavLink } from "react-router-dom";
import type { IconName } from "shared";
import Icon from "@/components/atoms/Icon/Icon";
import styles from "./NavItem.module.css";

interface NavItemProps {
  to: string;
  icon: IconName;
  label: string;
}

const NavItem = ({ to, icon, label }: NavItemProps) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive ? `${styles.item} ${styles.active}` : `${styles.item}`
      }
    >
      <Icon name={icon} className={styles.logo} />
      <span className={styles.label}>{label}</span>
    </NavLink>
  );
};

export default NavItem;
