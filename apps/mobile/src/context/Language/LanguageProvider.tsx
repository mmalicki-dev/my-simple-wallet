import { useState, useCallback, useMemo, ReactNode } from "react";
import { LanguageContext, Language, DEFAULT_LANGUAGE } from "./LanguageContext";
import { StorageService } from "@/services/storage";

const getSavedLanguage = (): Language => {
  const stored = StorageService.getString("lang") as Language | undefined;
  if (stored === "en" || stored === "pl" || stored === "no") return stored;
  return DEFAULT_LANGUAGE;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Language>(getSavedLanguage);

  const setLanguage = useCallback((next: Language) => {
    StorageService.setString("lang", next);
    setLang(next);
  }, []);

  const value = useMemo(
    () => ({ language: lang, setLanguage }),
    [lang, setLanguage],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
