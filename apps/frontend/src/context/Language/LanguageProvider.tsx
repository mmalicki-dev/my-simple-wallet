import { useEffect, useMemo, ReactNode } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { LanguageContext, Language, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from './LanguageContext'

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const { lang } = useParams<{ lang: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  const language: Language = SUPPORTED_LANGUAGES.has(lang as Language)
    ? (lang as Language)
    : DEFAULT_LANGUAGE

  useEffect(() => {
    if (lang !== language) {
      const newPath = location.pathname.replace(`/${lang}`, `/${language}`)
      navigate(newPath, { replace: true })
    }
  }, [lang])

  const setLanguage = (newLang: Language) => {
    const newPath = location.pathname.replace(`/${language}`, `/${newLang}`)
    navigate(newPath)
  }

  const value = useMemo(() => ({ language, setLanguage }), [language])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}
