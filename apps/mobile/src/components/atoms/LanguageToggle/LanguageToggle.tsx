import { Toggle } from "@/components/atoms/Toggle/Toggle";
import { useLanguage } from "@/hooks";
import { SUPPORTED_LANGUAGES } from "@/context/Language";
import type { Language } from "@/context/Language";

const OPTIONS = [...SUPPORTED_LANGUAGES].map((lang) => ({
  value: lang,
  label: lang.toUpperCase(),
}));

export const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <Toggle
      options={OPTIONS}
      value={language}
      onChange={(val) => setLanguage(val as Language)}
    />
  );
};
