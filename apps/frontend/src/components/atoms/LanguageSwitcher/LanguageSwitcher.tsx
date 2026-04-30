import { useContext } from "react";
import { LanguageContext, SUPPORTED_LANGUAGES } from "@/context";
import SciSelector from "@/components/atoms/SciSelector/SciSelector";

interface Props {
  side?: "left" | "right";
}

const LanguageSwitcher = ({ side = "right" }: Props) => {
  const langCtx = useContext(LanguageContext);
  const current = langCtx?.language ?? "";

  const options = [...SUPPORTED_LANGUAGES]
    .filter((l) => l !== current)
    .map((lang) => ({
      label: lang.toUpperCase(),
      onClick: () => langCtx?.setLanguage(lang),
    }));

  return <SciSelector value={current.toUpperCase()} options={options} side={side} />;
};

export default LanguageSwitcher;
