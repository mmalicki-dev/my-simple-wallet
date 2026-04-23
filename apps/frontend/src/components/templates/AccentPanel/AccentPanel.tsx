import { ReactNode } from "react";
import styles from "./AccentPanel.module.css";

interface AccentPanelProps {
  children: ReactNode;
  className?: string;
}

const AccentPanel = ({ children, className }: AccentPanelProps) => {
  return (
    <div className={[styles.panel, className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
};

export default AccentPanel;
