import { ReactNode } from "react";
import styles from "./ChartControlsItem.module.css";

interface ChartControlsItemProps {
  label: string;
  children: ReactNode;
  className?: string;
}

const ChartControlsItem = ({
  label,
  children,
  className,
}: ChartControlsItemProps) => (
  <div className={[styles.item, className].filter(Boolean).join(" ")}>
    <span className={styles.label}>{label}</span>
    {children}
  </div>
);

export default ChartControlsItem;
