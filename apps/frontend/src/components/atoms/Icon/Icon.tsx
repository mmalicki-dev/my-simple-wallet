import type { IconName } from "shared";
import styles from "./Icon.module.css";

interface IconProps {
  name: IconName;
  className?: string;
}

const Icon = ({ name, className }: IconProps) => {
  return (
    <svg
      className={className ? `${styles.svg} ${className}` : `${styles.svg}`}
      aria-hidden="true"
      focusable="false"
    >
      <use href={`/icons.svg#${name}`} />
    </svg>
  );
};

export default Icon;
