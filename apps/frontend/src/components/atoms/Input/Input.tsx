import type { InputHTMLAttributes } from "react";
import styles from "./Input.module.css";

type InputType = "text" | "email" | "password" | "date";

interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  type?: InputType;
  error?: boolean;
  className?: string;
}

const Input = ({ type = "text", error, className, ...rest }: InputProps) => {
  function combineClasses(): string {
    let classNames = styles.input;
    if (error) classNames = classNames + "" + `${styles.error}`;
    if (className) classNames = classNames + "" + `${className}`;
    return classNames;
  }
  return <input type={type} className={combineClasses()} {...rest} />;
};

export default Input;
