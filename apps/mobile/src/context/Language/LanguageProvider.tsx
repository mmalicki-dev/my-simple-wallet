import { useState, useCallback, useMemo, ReactNode } from 'react'
import { LanguageContext, Language, DEFAULT_LANGUAGE } from './LanguageContext'
import { StorageService } from '@/services/storage'

const getSavedLanguage = (): Language => {
  const stored = StorageService.getString('lang') as Language | undefined
  if (stored === 'en' || stored === 'pl' || stored === 'no') return stored
  return DEFAULT_LANGUAGE
}

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(getSavedLanguage)

  const setLanguage = useCallback((lang: Language) => {
    StorageService.setString('lang', lang)
    setLanguageState(lang)
  }, [])

  const value = useMemo(() => ({ language, setLanguage }), [language, setLanguage])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}
