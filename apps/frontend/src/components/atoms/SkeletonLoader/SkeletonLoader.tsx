import styles from "./SkeletonLoader.module.css";

interface SkeletonLoaderProps {
  className?: string;
  count?: number;
}

const SkeletonLoader = ({ className, count = 1 }: SkeletonLoaderProps) => {
  const lines = Array.from({ length: count });
  return (
    <>
      {lines.map((_, i) => (
        <div
          key={i}
          className={[styles.skeleton, className].filter(Boolean).join(" ")}
          aria-hidden="true"
        />
      ))}
    </>
  );
};

export default SkeletonLoader;
