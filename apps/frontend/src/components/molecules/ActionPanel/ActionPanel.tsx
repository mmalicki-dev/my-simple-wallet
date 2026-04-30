import { useState, useEffect, useId, type ReactNode } from "react";
import AccentPanel from "@/components/templates/AccentPanel/AccentPanel";
import QuickActions from "@/components/molecules/QuickActions/QuickActions";
import styles from "./ActionPanel.module.css";

const EVENT = "actionpanel:open";

interface ActionPanelProps {
  children: ReactNode;
  className?: string;
  onlyRightBorder?: boolean;
  onViewMore?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ActionPanel = ({
  children,
  className,
  onlyRightBorder = false,
  onViewMore,
  onEdit,
  onDelete,
}: ActionPanelProps) => {
  const id = useId();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handler = (e: CustomEvent<{ id: string }>) => {
      if (e.detail.id !== id) setIsOpen(false);
    };
    globalThis.addEventListener(EVENT, handler as EventListener);
    return () => globalThis.removeEventListener(EVENT, handler as EventListener);
  }, [id]);

  const open = () => {
    setIsOpen(true);
    globalThis.dispatchEvent(new CustomEvent(EVENT, { detail: { id } }));
  };

  return (
    <div
      role="none"
      className={styles.wrapper}
      onMouseEnter={open}
      onMouseLeave={() => setIsOpen(false)}
      onClick={() => { if (isOpen) setIsOpen(false); else open(); }}
    >
      <AccentPanel className={className} onlyRightBorder={onlyRightBorder}>{children}</AccentPanel>
      <QuickActions
        isOpen={isOpen}
        onViewMore={onViewMore}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
};

export default ActionPanel;
