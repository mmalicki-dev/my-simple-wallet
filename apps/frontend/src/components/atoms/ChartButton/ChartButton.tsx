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
  <button
    type="button"
    role="radio"
    aria-checked={active}
    aria-label={ariaLabel}
    disabled={disabled}
    title={title}
    onClick={onClick}
    className={cx(
      styles.button,
      active && styles.active,
      disabled && styles.disabled,
    )}
  >
    {children}
  </button>
);

export default ChartButton;
