import { Navigate } from 'react-router-dom'
import { useAppSelector } from '@/hooks'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />
}

export default ProtectedRoute
