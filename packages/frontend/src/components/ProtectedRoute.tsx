import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

interface Props {
  requiredRoles?: string[]
}

const ProtectedRoute: React.FC<Props> = ({ requiredRoles }) => {
  const { isAuthenticated, hasRole } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (requiredRoles && requiredRoles.length > 0 && !hasRole(requiredRoles)) return <Navigate to="/" replace />
  return <Outlet />
}

export default ProtectedRoute
