import { ReactNode } from "react";
import styles from "./AccentPanel.module.css";

interface AccentPanelProps {
  children: ReactNode;
  className?: string;
  isLoading?: boolean;
}

const AccentPanel = ({ children, className, isLoading }: AccentPanelProps) => {
  return (
    <div className={[styles.panel, className].filter(Boolean).join(" ")}>
      {children}
      {isLoading ? (
        <span className={styles.shimmer} aria-hidden="true">
          <span className={styles.border} />
        </span>
      ) : (
        <span className={styles.border} />
      )}
    </div>
  );
};

export default AccentPanel;
