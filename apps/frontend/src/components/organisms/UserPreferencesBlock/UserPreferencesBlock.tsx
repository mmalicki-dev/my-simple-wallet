import { useContext } from 'react'
import { LanguageContext, SUPPORTED_LANGUAGES } from '@/context/Language/LanguageContext'
import type { Language } from '@/context/Language/LanguageContext'
import UserBlockWrapper from '@/components/molecules/UserBlockWrapper/UserBlockWrapper'
import Input from '@/components/atoms/Input/Input'
import styles from './UserPreferencesBlock.module.css'

const UserPreferencesBlock = () => {
  const langCtx = useContext(LanguageContext)

  return (
    <UserBlockWrapper title="Preferences">
      <div className={styles.field}>
        <label htmlFor="language" className={styles.label}>Language</label>
        <select
          id="language"
          className={styles.select}
          value={langCtx?.language}
          onChange={(e) => langCtx?.setLanguage(e.target.value as Language)}
        >
          {[...SUPPORTED_LANGUAGES].map((lang) => (
            <option key={lang} value={lang}>{lang.toUpperCase()}</option>
          ))}
        </select>
      </div>
      <div className={styles.field}>
        <label htmlFor="baseCurrency" className={styles.label}>Base Currency</label>
        <Input id="baseCurrency" value="" disabled placeholder="Coming soon" />
      </div>
    </UserBlockWrapper>
  )
}

export default UserPreferencesBlock
