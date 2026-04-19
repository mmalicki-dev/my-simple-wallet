import styles from "./Spinner.module.css";

interface SpinnerProps {
  className?: string;
}

const Spinner = ({ className }: SpinnerProps) => {
  return (
    <output
      className={`${styles.spinner}${className ? ` ${className}` : ""}`}
      aria-label="Loading"
    />
  );
};

export default Spinner;
