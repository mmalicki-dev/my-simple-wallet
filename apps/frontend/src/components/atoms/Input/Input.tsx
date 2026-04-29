import type { InputHTMLAttributes } from "react";
import styles from "./Input.module.css";

type InputType = "text" | "email" | "password" | "date";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  type?: InputType;
  error?: boolean;
  className?: string;
}

const Input = ({ type = "text", error, className, ...rest }: InputProps) => {
  const classes = [styles.input, error && styles.error, className]
    .filter(Boolean)
    .join(" ");
  return <input type={type} className={classes} {...rest} />;
};

export default Input;
