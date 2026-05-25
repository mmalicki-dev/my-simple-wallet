import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import Layout from '@/components/templates/Layout/Layout'
import { LanguageProvider, SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/context/Language'
import type { Language } from '@/context/Language'

const HomePage = lazy(() => import('@/pages/HomePage/HomePage'))
const AccountPage = lazy(() => import('@/pages/AccountPage/AccountPage'))
const UserPage = lazy(() => import('@/pages/UserPage/UserPage'))
const ChartPage = lazy(() => import('@/pages/ChartPage/ChartPage'))
const AuthPage = lazy(() => import('@/pages/AuthPage/AuthPage'))
const VerifyEmailPage = lazy(() => import('@/pages/VerifyEmailPage/VerifyEmailPage'))
const ConfirmEmailChangePage = lazy(() => import('@/pages/ConfirmEmailChangePage/ConfirmEmailChangePage'))

const getSavedLang = (): Language => {
  const stored = localStorage.getItem('lang') as Language | null
  if (stored && SUPPORTED_LANGUAGES.has(stored)) return stored
  const browser = navigator.language.split('-')[0] as Language
  return SUPPORTED_LANGUAGES.has(browser) ? browser : DEFAULT_LANGUAGE
}

const AppRouter = () => {
  const lang = getSavedLang()

  return (
    <Suspense fallback={null}>
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
            <Route path="accounts/:id" element={<AccountPage />} />
            <Route path="charts" element={<ChartPage />} />
            <Route path="user">
              <Route index element={<Navigate to="profile" replace />} />
              <Route path=":tab" element={<UserPage />} />
            </Route>
          </Route>
        </Route>
        <Route path="verify-email" element={<VerifyEmailPage />} />
        <Route path="confirm-email-change" element={<ConfirmEmailChangePage />} />
        <Route path="*" element={<Navigate to={`/${lang}/home`} replace />} />
      </Routes>
    </Suspense>
  )
}

export default AppRouter
