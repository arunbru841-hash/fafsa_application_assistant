'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import {
  User,
  LoginCredentials,
  RegisterData,
  ProfileUpdateData,
  ChangePasswordData,
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  getCurrentUser,
  updateProfile as apiUpdateProfile,
  changePassword as apiChangePassword,
  tokenStorage,
  isAuthenticated as checkAuth,
} from './api/auth'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: ProfileUpdateData) => Promise<void>
  changePassword: (data: ChangePasswordData) => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Routes that don't require authentication
const publicRoutes = [
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/fafsa-changes',
  '/deadlines',
  '/schools',
  '/aid-estimator',
  '/manage-loans',
  '/help-center',
]

// Check if a route is public
function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  )
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Initialize auth state from stored data
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = tokenStorage.getUser()
        const token = tokenStorage.getToken()
        
        if (token && storedUser) {
          // Set user from storage first for immediate UI
          setUser(storedUser)
          
          // Then verify with server and update
          try {
            const freshUser = await getCurrentUser()
            setUser(freshUser)
          } catch (error) {
            // Token expired or invalid
            console.error('Token validation failed:', error)
            tokenStorage.clear()
            setUser(null)
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        tokenStorage.clear()
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  // Redirect logic for protected routes
  useEffect(() => {
    if (!isLoading && !user && !isPublicRoute(pathname)) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [isLoading, user, pathname, router])

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true)
    try {
      const response = await apiLogin(credentials)
      setUser(response.user)
      
      // Redirect to intended page or dashboard
      const params = new URLSearchParams(window.location.search)
      const redirect = params.get('redirect') || '/application/getting-started'
      router.push(redirect)
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true)
    try {
      const response = await apiRegister(data)
      setUser(response.user)
      
      // Redirect to getting started after registration
      router.push('/application/getting-started')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const logout = useCallback(async () => {
    setIsLoading(true)
    try {
      await apiLogout()
      setUser(null)
      router.push('/')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const updateProfile = useCallback(async (data: ProfileUpdateData) => {
    const updatedUser = await apiUpdateProfile(data)
    setUser(updatedUser)
  }, [])

  const changePassword = useCallback(async (data: ChangePasswordData) => {
    await apiChangePassword(data)
  }, [])

  const refreshUser = useCallback(async () => {
    try {
      const freshUser = await getCurrentUser()
      setUser(freshUser)
    } catch (error) {
      console.error('Failed to refresh user:', error)
      tokenStorage.clear()
      setUser(null)
    }
  }, [])

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Hook for checking auth on component mount (useful for protected pages)
export function useRequireAuth(redirectTo = '/login') {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`${redirectTo}?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [isLoading, isAuthenticated, router, redirectTo, pathname])

  return { user, isLoading, isAuthenticated }
}
