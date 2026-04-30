import { useContext } from "react";
import { ThemeContext } from "@/context";
import Icon from "@/components/atoms/Icon/Icon";
import SciSelector from "@/components/atoms/SciSelector/SciSelector";
import styles from "./ThemeToggle.module.css";

interface Props {
  side?: "left" | "right";
}

const ThemeToggle = ({ side = "left" }: Props) => {
  const themeCtx = useContext(ThemeContext);
  const current = themeCtx?.theme ?? "dark";
  const other = current === "dark" ? "light" : "dark";

  const options = [
    {
      label: other,
      icon: <Icon name={other === "dark" ? "moon" : "sun"} className={styles.icon} />,
      ariaLabel: `Switch to ${other} theme`,
      onClick: () => themeCtx?.toggleTheme?.(),
    },
  ];

  return (
    <SciSelector
      value={<Icon name={current === "dark" ? "moon" : "sun"} className={styles.icon} />}
      valueLabel={current}
      options={options}
      side={side}
    />
  );
};

export default ThemeToggle;
