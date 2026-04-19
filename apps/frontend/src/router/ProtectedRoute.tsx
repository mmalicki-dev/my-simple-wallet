import { Navigate, useParams } from 'react-router-dom'
import { useAppSelector } from '@/hooks'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { lang = 'en' } = useParams()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  return isAuthenticated ? <>{children}</> : <Navigate to={`/${lang}/auth`} replace />
}

export default ProtectedRoute
