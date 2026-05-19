import type { ReactNode } from "react";
import styles from "./ChartOption.module.css";

interface ChartOptionProps {
  type: "radio" | "checkbox";
  name: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  children: ReactNode;
}

const ChartOption = ({
  type,
  name,
  checked,
  onChange,
  disabled,
  children,
}: ChartOptionProps) => (
  <label className={`${styles.option}${disabled ? ` ${styles.disabled}` : ""}`}>
    <input
      type={type}
      name={name}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
    />
    <span className={styles.indicator} aria-hidden="true" />
    <span className={styles.label}>{children}</span>
  </label>
);

export default ChartOption;
