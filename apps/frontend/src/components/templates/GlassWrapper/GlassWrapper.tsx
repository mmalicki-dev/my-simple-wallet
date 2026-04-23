import { ReactNode, useRef } from "react";
import styles from "./GlassWrapper.module.css";

interface GlassWrapperProps {
  animated?: boolean;
  children: ReactNode;
  className?: string;
}

const MAX_TILT = 8;

const GlassWrapper = ({
  animated = false,
  children,
  className,
}: GlassWrapperProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (ref.current) ref.current.style.transition = "none";
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const { left, top, width, height } = el.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const rotateX = ((y - height / 2) / (height / 2)) * -MAX_TILT;
    const rotateY = ((x - width / 2) / (width / 2)) * MAX_TILT;
    el.style.transition = "transform 0.5s ease-out";
    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform 0.5s ease-out";
    el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg)";
  };

  if (animated)
    return (
      <div
        ref={ref}
        role="none"
        className={[styles.wrapper, className].join(" ")}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
    );

  return (
    <div
      ref={ref}
      role="none"
      className={[styles.wrapper, className].join(" ")}
    >
      {children}
    </div>
  );
};

export default GlassWrapper;
