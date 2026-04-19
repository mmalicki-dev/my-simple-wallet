import { createContext } from 'react'

export type Language = 'en' | 'pl' | 'no'

export const SUPPORTED_LANGUAGES = new Set<Language>(['en', 'pl', 'no'])
export const DEFAULT_LANGUAGE: Language = 'en'

export interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined)
