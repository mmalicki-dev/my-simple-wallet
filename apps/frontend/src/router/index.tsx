import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import Layout from '@/components/templates/Layout/Layout'
import HomePage from '@/pages/HomePage/HomePage'
import AuthPage from '@/pages/AuthPage/AuthPage'
import { LanguageProvider } from '@/context/Language'

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/en/home" replace />} />
      <Route
        path="/:lang"
        element={
          <LanguageProvider>
            <Outlet />
          </LanguageProvider>
        }
      >
        <Route path="auth" element={<AuthPage />} />
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
      <Route path="*" element={<Navigate to="/en/home" replace />} />
    </Routes>
  )
}

export default AppRouter
