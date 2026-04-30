import { useState, useEffect } from "react";
import type { ButtonHTMLAttributes } from "react";
import type { IconName } from "shared";
import Icon from "@/components/atoms/Icon/Icon";
import Spinner from "@/components/atoms/Spinner/Spinner";
import styles from "./Button.module.css";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type DisplayState = "idle" | "success" | "error";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: IconName;
  isLoading?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  className?: string;
}

const Button = ({
  variant = "primary",
  icon,
  isLoading,
  isSuccess,
  isError,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) => {
  const [display, setDisplay] = useState<DisplayState>("idle");

  useEffect(() => {
    if (isSuccess) {
      setDisplay("success");
      const t = setTimeout(() => setDisplay("idle"), 500);
      return () => clearTimeout(t);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      setDisplay("error");
      const t = setTimeout(() => setDisplay("idle"), 500);
      return () => clearTimeout(t);
    }
  }, [isError]);

  return (
    <button
      className={[
        styles.button,
        variant !== "primary" && styles[variant],
        display === "success" && styles.success,
        display === "error" && styles.error,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading && (
        <span className={styles.iconWrapper}>
          <Spinner className={styles.icon} />
        </span>
      )}
      {display === "success" && (
        <span className={styles.iconWrapper}>
          <Icon name="confirm" className={styles.icon} />
        </span>
      )}
      {display === "error" && <span className={styles.iconWrapper}>✗</span>}
      {icon && (
        <span className={styles.iconWrapper}>
          <Icon name={icon} className={styles.icon} />
        </span>
      )}
      {display === "idle" && children}
    </button>
  );
};

export default Button;
