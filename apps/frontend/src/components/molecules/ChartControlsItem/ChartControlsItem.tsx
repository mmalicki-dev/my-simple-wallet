import { ReactNode, HTMLAttributes } from "react";
import styles from "./ChartControlsItem.module.css";

interface ChartControlsItemProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  children: ReactNode;
  footer?: ReactNode;
}

const ChartControlsItem = ({
  label,
  children,
  footer,
  className,
  ...rest
}: ChartControlsItemProps) => (
  <div
    className={[styles.item, className].filter(Boolean).join(" ")}
    {...rest}
  >
    <span className={styles.label}>{label}</span>
    <div className={styles.scroll}>{children}</div>
    {footer}
  </div>
);

export default ChartControlsItem;
