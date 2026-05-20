import { useState, useMemo, ReactNode } from 'react'
import { ThemeContext, Theme } from './ThemeContext'
import { StorageService } from '@/services/storage'

const getSavedTheme = (): Theme => {
  const stored = StorageService.getString('theme') as Theme | undefined
  if (stored === 'light' || stored === 'dark') return stored
  return 'light'
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(getSavedTheme)

  const toggleTheme = () =>
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light'
      StorageService.setString('theme', next)
      return next
    })

  const value = useMemo(() => ({ theme, toggleTheme }), [theme])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
