import { ReactNode } from "react";
import styles from "./AccentPanel.module.css";

interface AccentPanelProps {
  children: ReactNode;
  className?: string;
  onlyRightBorder?: boolean;
}

const AccentPanel = ({
  children,
  className,
  onlyRightBorder = false,
}: AccentPanelProps) => {
  return (
    <div
      className={[styles.panel, onlyRightBorder && styles.onlyRight, className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
      <span className={styles.border} />
    </div>
  );
};

export default AccentPanel;
