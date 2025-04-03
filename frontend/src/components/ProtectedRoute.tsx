import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Loading from './Loading'

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <Loading />
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />
}

export default ProtectedRoute
