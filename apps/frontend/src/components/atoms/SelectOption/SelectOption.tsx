import type { SelectHTMLAttributes } from "react";
import styles from "./SelectOption.module.css";

interface Option {
  value: string;
  label: string;
}

interface SelectOptionProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
  error?: boolean;
}

const SelectOption = ({
  options,
  error,
  className,
  ...props
}: SelectOptionProps) => {
  function combineClasses(): string {
    let classNames = styles.input;
    if (error) classNames = classNames + "" + `${styles.error}`;
    if (className) classNames = classNames + "" + `${className}`;
    return classNames;
  }
  return (
    <select {...props} className={combineClasses()}>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

export default SelectOption;
