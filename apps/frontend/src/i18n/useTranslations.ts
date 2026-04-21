import { useContext } from 'react'
import { LanguageContext } from '@/context'
import { translations } from './translations'

export const useTranslations = () => {
  const langCtx = useContext(LanguageContext)
  return translations[langCtx?.language as keyof typeof translations] ?? translations.en
}
