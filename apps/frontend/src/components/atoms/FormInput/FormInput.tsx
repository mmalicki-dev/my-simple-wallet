import styles from "./FormInput.module.css";

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
type InputProps = BaseProps & { type: "text" | "email" | "date" | "color" };
type TextareaProps = BaseProps & { type: "textarea" };
type SelectProps = BaseProps & { type: "select"; optionsArray: string[] };
type FormProps = InputProps | TextareaProps | SelectProps;

const FormInput = (props: FormProps) => {
  const {
    id,
    type,
    label,
    placeholder,
    value,
    isOptional = false,
    handleChange,
  } = props;
  const optionsArray = props.type === "select" ? props.optionsArray : undefined;

  return (
    <div className={styles.field}>
      <label className={styles.fieldLabel} htmlFor={id}>
        {label}
        {isOptional && <span className={styles.optional}> (optional)</span>}
      </label>
      {(type === "text" ||
        type === "email" ||
        type === "date" ||
        type === "color") && (
        <input
          id={id}
          name={id}
          type={type}
          required={isOptional}
          value={value}
          onChange={handleChange}
          className={styles.input}
          placeholder={placeholder}
          autoComplete={id}
        />
      )}
      {type === "select" && (
        <select
          id={id}
          name={id}
          value={value}
          required={isOptional}
          onChange={handleChange}
          className={styles.select}
        >
          <option value="">{placeholder}</option>
          {optionsArray?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )}
      {type === "textarea" && (
        <textarea
          id={id}
          name={id}
          required={isOptional}
          rows={4}
          value={value}
          onChange={handleChange}
          className={styles.textarea}
          placeholder={placeholder}
        />
      )}
    </div>
  );
};

export default FormInput;
