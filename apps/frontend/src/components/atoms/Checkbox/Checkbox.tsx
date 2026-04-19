import type { InputHTMLAttributes } from "react";
import styles from "./Checkbox.module.css";

interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label: string;
}

const Checkbox = ({ label, className, id, ...props }: CheckboxProps) => {
  return (
    <label
      className={
        className ? `${styles.amount}${className}` : `${styles.amount}`
      }
      htmlFor={id}
    >
      <input {...props} id={id} type="checkbox" className={styles.input} />
      <span className={styles.label}>{label}</span>
    </label>
  );
};

export default Checkbox;
