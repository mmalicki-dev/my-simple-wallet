import styles from "./PanelLabel.module.css";

interface PanelLabelProps {
  label: string;
  className?: string;
}

const PanelLabel = ({ label, className }: PanelLabelProps) => {
  return (
    <span className={[styles.label, className].filter(Boolean).join(" ")}>
      {label}
    </span>
  );
};

export default PanelLabel;
