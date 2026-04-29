import { useState, useRef, useEffect, type ReactNode } from "react";
import styles from "./SciSelector.module.css";

export interface SciSelectorOption {
  label: string;      // used as React key and aria fallback
  icon?: ReactNode;   // rendered instead of label text when provided
  onClick: () => void;
  ariaLabel?: string;
}

interface Props {
  value: ReactNode;
  valueLabel?: string;
  options: SciSelectorOption[];
  side?: "left" | "right";
}

const SciSelector = ({ value, valueLabel, options, side = "right" }: Props) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div
      ref={ref}
      className={[styles.switcher, open && styles.open].filter(Boolean).join(" ")}
      data-side={side}
    >
      <div className={styles.options}>
        {options.map((opt) => (
          <button
            key={opt.label}
            type="button"
            className={styles.option}
            onClick={() => {
              opt.onClick();
              setOpen(false);
            }}
            aria-label={opt.ariaLabel ?? opt.label}
          >
            {opt.icon ?? opt.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        className={styles.current}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label={valueLabel}
      >
        {value}
      </button>
    </div>
  );
};

export default SciSelector;
