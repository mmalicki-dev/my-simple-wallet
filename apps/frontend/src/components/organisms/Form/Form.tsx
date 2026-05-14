import styles from "./Form.module.css";
import FormInput from "@/components/atoms/FormInput/FormInput";
import { ReactNode } from "react";

type BaseProps = {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  isRequired?: boolean;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
};
type TextProps = BaseProps & { type: "text" | "email" };
type TextareaProps = BaseProps & { type: "textarea" };
type SelectProps = BaseProps & { type: "select"; optionsArray: string[] };

type FormProps = {
  handleChange: () => void;
  handleSubmit: () => void;
  inputsArray?: TextProps[];
  textareasArray?: TextareaProps[];
  selectsArray?: SelectProps[];
  children?: ReactNode;
};

const Form = (props: FormProps) => {
  const {
    handleChange,
    handleSubmit,
    inputsArray,
    textareasArray,
    selectsArray,
    children,
  } = props;
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {inputsArray?.map((e) => (
        <FormInput
          key={e.id}
          id={e.id}
          type={e.type}
          label={e.label}
          placeholder={e.placeholder}
          value={e.value}
          handleChange={handleChange}
        />
      ))}
      {textareasArray?.map((e) => (
        <FormInput
          key={e.id}
          id={e.id}
          type={e.type}
          label={e.label}
          placeholder={e.placeholder}
          value={e.value}
          handleChange={handleChange}
        />
      ))}
      {selectsArray?.map((e) => (
        <FormInput
          key={e.id}
          id={e.id}
          type={e.type}
          label={e.label}
          placeholder={e.placeholder}
          value={e.value}
          optionsArray={e.optionsArray}
          handleChange={handleChange}
        />
      ))}
      {children}
    </form>
  );
};

export default Form;
