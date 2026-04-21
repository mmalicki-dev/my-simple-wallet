import { useContext } from 'react'
import { LanguageContext, SUPPORTED_LANGUAGES } from '@/context'
import type { Language } from '@/context'
import styles from './LanguageSwitcher.module.css'

const LanguageSwitcher = () => {
  const langCtx = useContext(LanguageContext)

  return (
    <div className={styles.switcher}>
      {[...SUPPORTED_LANGUAGES].map((lang) => (
        <button
          key={lang}
          type="button"
          className={[styles.option, langCtx?.language === lang ? styles.active : ''].join(' ')}
          onClick={() => langCtx?.setLanguage(lang as Language)}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

export default LanguageSwitcher
