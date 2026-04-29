import { useState } from "react";
import type { InputHTMLAttributes } from "react";
import Input from "@/components/atoms/Input/Input";
import Icon from "@/components/atoms/Icon/Icon";
import styles from "./PasswordInput.module.css";

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  error?: boolean;
};

const PasswordInput = ({ error, ...rest }: PasswordInputProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className={styles.wrapper}>
      <Input type={visible ? "text" : "password"} error={error} {...rest} />
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        tabIndex={-1}
      >
        <Icon
          name={visible ? "eye-open" : "eye-closed"}
          className={styles.icon}
        />
      </button>
    </div>
  );
};

export default PasswordInput;
