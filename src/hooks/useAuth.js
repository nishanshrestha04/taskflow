import { useEffect } from 'react'
import useAuthStore from '../store/authStore'

export function useAuth() {
  const { user, isAuthenticated, isLoading, error, login, logout, clearError, initAuth } =
    useAuthStore()

  useEffect(() => {
    initAuth()
    // Listen for global auth:logout event dispatched by API interceptor
    const handler = () => logout()
    window.addEventListener('auth:logout', handler)
    return () => window.removeEventListener('auth:logout', handler)
  }, [])

  return { user, isAuthenticated, isLoading, error, login, logout, clearError }
}
