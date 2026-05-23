import { Toggle } from "@/components/atoms/Toggle/Toggle";
import { useTheme } from "@/hooks";

const OPTIONS = [
  { value: "light", label: "", icon: "sun" as const },
  { value: "dark", label: "", icon: "moon" as const },
];

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  const handleChange = (val: string) => {
    if (val !== theme) toggleTheme();
  };

  return <Toggle options={OPTIONS} value={theme} onChange={handleChange} />;
};
