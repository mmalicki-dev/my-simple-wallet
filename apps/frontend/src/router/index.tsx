import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import Layout from '@/components/templates/Layout/Layout'
import HomePage from '@/pages/HomePage/HomePage'
import AuthPage from '@/pages/AuthPage/AuthPage'
import { LanguageProvider, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/context/Language'
import type { Language } from '@/context/Language'

const getSavedLang = (): Language => {
  const stored = localStorage.getItem('lang') as Language | null
  if (stored && SUPPORTED_LANGUAGES.has(stored)) return stored
  const browser = navigator.language.split('-')[0] as Language
  return SUPPORTED_LANGUAGES.has(browser) ? browser : DEFAULT_LANGUAGE
}

const AppRouter = () => {
  const lang = getSavedLang()

  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/${lang}/home`} replace />} />
      <Route
        path="/:lang"
        element={
          <LanguageProvider>
            <Outlet />
          </LanguageProvider>
        }
      >
        <Route index element={<Navigate to="home" replace />} />
        <Route path="auth">
          <Route index element={<Navigate to="login" replace />} />
          <Route path=":mode" element={<AuthPage />} />
        </Route>
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="home" element={<HomePage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to={`/${lang}/home`} replace />} />
    </Routes>
  )
}

export default AppRouter
