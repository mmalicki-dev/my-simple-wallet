import styles from "./Spinner.module.css";

interface SpinnerProps {
  className?: string;
}

const Spinner = ({ className }: SpinnerProps) => {
  return (
    <div
      className={[styles.spinner, className].filter(Boolean).join(" ")}
      aria-label="Loading"
    />
  );
};

export default Spinner;
