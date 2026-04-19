import styles from "./Spinner.module.css";

interface SpinnerProps {
  className?: string;
}

const Spinner = ({ className }: SpinnerProps) => {
  return (
    <output
      className={
        className ? `${styles.amount} ${className}` : `${styles.amount}`
      }
      aria-label="Loading"
    />
  );
};

export default Spinner;
