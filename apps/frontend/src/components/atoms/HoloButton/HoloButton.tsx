import type { ReactNode } from "react";
import Spinner from "@/components/atoms/Spinner/Spinner";
import styles from "./HoloButton.module.css";

interface HoloButtonProps {
  children: ReactNode;
  active?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  variant?: "default" | "danger";
  isLoading?: boolean;
  onClick?: () => void;
  ariaLabel?: string;
  title?: string;
}

const cx = (...classes: (string | false | undefined)[]) =>
  classes.filter(Boolean).join(" ");

const HoloButton = ({
  children,
  active,
  disabled = false,
  type = "button",
  variant = "default",
  isLoading = false,
  onClick,
  ariaLabel,
  title,
}: HoloButtonProps) => (
  <div className={cx(styles.outer, variant === "danger" && styles.danger)}>
    <button
      type={type}
      {...(active === undefined
        ? {}
        : { role: "radio", "aria-checked": active })}
      aria-label={ariaLabel}
      disabled={disabled || isLoading}
      title={title}
      onClick={onClick}
      className={cx(
        styles["btn-sci-holo"],
        active && styles.active,
        (disabled || isLoading) && styles.disabled,
      )}
    >
      {isLoading ? <Spinner className={styles.spinnerIcon} /> : children}
    </button>
    <span className={`${styles.corner} ${styles.tl}`} aria-hidden="true" />
    <span className={`${styles.corner} ${styles.tm}`} aria-hidden="true" />
    <span className={`${styles.corner} ${styles.tr}`} aria-hidden="true" />
    <span className={`${styles.corner} ${styles.bl}`} aria-hidden="true" />
    <span className={`${styles.corner} ${styles.br}`} aria-hidden="true" />
    <div className={styles.lines} aria-hidden="true" />
  </div>
);

export default HoloButton;
