import type { ReactNode } from "react";
import styles from "./PanelLabel.module.css";

interface PanelLabelProps {
  label?: string;
  side?: "left" | "right";
  className?: string;
  children?: ReactNode;
}

const PanelLabel = ({ label, side = "left", className, children }: PanelLabelProps) => {
  return (
    <span
      className={[styles.label, side === "right" ? styles.right : undefined, className]
        .filter(Boolean)
        .join(" ")}
    >
      {children ?? label}
    </span>
  );
};

export default PanelLabel;
