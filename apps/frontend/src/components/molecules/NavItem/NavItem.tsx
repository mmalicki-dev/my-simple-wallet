import { NavLink } from "react-router-dom";
import type { IconName } from "shared";
import Icon from "@/components/atoms/Icon/Icon";
import styles from "./NavItem.module.css";

type NavItemProps =
  | {
      as: "link";
      to: string;
      icon: IconName;
      label: string;
    }
  | { as: "button"; onClick: () => void; icon: IconName; label: string };

const NavItem = (props: NavItemProps) => {
  if (props.as === "button") {
    return (
      <button type="button" className={styles.item} onClick={props.onClick} title={props.label}>
        <Icon name={props.icon} className={styles.icon} />
        <span className={styles.label}>{props.label}</span>
      </button>
    );
  }
  return (
    <NavLink
      to={props.to}
      title={props.label}
      className={({ isActive }) =>
        isActive ? `${styles.item} ${styles.active}` : `${styles.item}`
      }
    >
      <Icon name={props.icon} className={styles.icon} />
      <span className={styles.label}>{props.label}</span>
    </NavLink>
  );
};

export default NavItem;
