import { ReactNode } from "react";
import styles from "./HudPanel.module.css";

interface HudPanelProps {
  children: ReactNode;
  className?: string;
}

const HudPanel = ({ children, className }: HudPanelProps) => {
  return (
    <div className={[styles.panel, className].filter(Boolean).join(" ")}>
      <span className={`${styles.corner} ${styles.tl}`} aria-hidden="true" />
      <span className={`${styles.corner} ${styles.tr}`} aria-hidden="true" />
      <span className={`${styles.corner} ${styles.bl}`} aria-hidden="true" />
      <span className={`${styles.corner} ${styles.br}`} aria-hidden="true" />
      {children}
    </div>
  );
};

export default HudPanel;
