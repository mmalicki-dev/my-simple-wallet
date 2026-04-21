import { ReactNode } from "react";
import styles from "./BlockWrapper.module.css";

interface BlockWrapperProps {
  extraClass?: string;
  children: ReactNode;
}

const BlockWrapper = ({ extraClass, children }: BlockWrapperProps) => {
  return <div className={[styles.neon, extraClass].join(" ")}>{children}</div>;
};

export default BlockWrapper;
