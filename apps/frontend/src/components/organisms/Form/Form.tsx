import styles from "./Form.module.css";
import FormInput from "@/components/atoms/FormInput/FormInput";
import { ReactNode } from "react";

type BaseProps = {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  isOptional?: boolean;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
};
type TextProps = BaseProps & { type: "text" | "email" | "color" | "date" };
type TextareaProps = BaseProps & { type: "textarea" };
type SelectProps = BaseProps & { type: "select"; optionsArray: string[] };

type FormProps = {
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  inputsArray?: TextProps[];
  textareasArray?: TextareaProps[];
  selectsArray?: SelectProps[];
  header?: ReactNode;
  children?: ReactNode;
};

const Form = (props: FormProps) => {
  const {
    handleChange,
    handleSubmit,
    inputsArray,
    textareasArray,
    selectsArray,
    header,
    children,
  } = props;
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {header}
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
