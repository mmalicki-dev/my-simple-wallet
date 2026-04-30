import type { ReactNode } from "react";
import styles from "./ChartButton.module.css";

interface ChartButtonProps {
  active: boolean;
  disabled?: boolean;
  onClick: () => void;
  ariaLabel?: string;
  title?: string;
  children: ReactNode;
}

const cx = (...classes: (string | false | undefined)[]) =>
  classes.filter(Boolean).join(" ");

const ChartButton = ({
  active,
  disabled = false,
  onClick,
  ariaLabel,
  title,
  children,
}: ChartButtonProps) => (
  <div className={styles.outer}>
    <button
      type="button"
      role="radio"
      aria-checked={active}
      aria-label={ariaLabel}
      disabled={disabled}
      title={title}
      onClick={onClick}
      className={cx(
        styles["btn-sci-holo"],
        active && styles.active,
        disabled && styles.disabled,
      )}
    >
      {children}
    </button>
    <span className={`${styles.corner} ${styles.tl}`} aria-hidden="true" />
    <span className={`${styles.corner} ${styles.tm}`} aria-hidden="true" />
    <span className={`${styles.corner} ${styles.tr}`} aria-hidden="true" />
    <span className={`${styles.corner} ${styles.bl}`} aria-hidden="true" />
    <span className={`${styles.corner} ${styles.br}`} aria-hidden="true" />
    <div className={styles.lines} aria-hidden="true" />
  </div>
);

export default ChartButton;
