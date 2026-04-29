import { ReactNode } from "react";
import styles from "./AccentPanel.module.css";

interface AccentPanelProps {
  children: ReactNode;
  className?: string;
  onlyRightBorder?: boolean;
  hideBorder?: boolean;
}

const AccentPanel = ({
  children,
  className,
  onlyRightBorder = false,
  hideBorder = false,
}: AccentPanelProps) => {
  return (
    <div
      className={[styles.panel, onlyRightBorder && styles.onlyRight, className]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
      <span className={[styles.border, hideBorder && styles.borderHidden].filter(Boolean).join(" ")} />
    </div>
  );
};

export default AccentPanel;
