import { ReactNode } from "react";

interface TabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  containerClass: string;
  itemClass: string;
  activeTabClass: string;
}

const Tabs = ({
  tabs,
  activeTab,
  onTabChange,
  containerClass,
  itemClass,
  activeTabClass,
}: TabsProps) => {
  return (
    <div className={containerClass}>
      {tabs.map((t): ReactNode => (
        <button
          key={t}
          type="button"
          className={[itemClass, t === activeTab ? activeTabClass : ""].join(" ")}
          onClick={() => onTabChange(t)}
        >
          {t.split(" ").map((word) => word[0].toUpperCase() + word.slice(1)).join(" ")}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
