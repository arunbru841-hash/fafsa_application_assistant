/**
 * Auth API Service
 * 
 * Handles authentication-related API calls
 */

import { apiClient, handleApiError } from './client'

// Types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'user' | 'staff' | 'admin'
  verified: boolean
  createdAt?: string
  lastLoginAt?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface AuthResponse {
  message: string
  user: User
  accessToken: string
  refreshToken: string
}

export interface ProfileUpdateData {
  firstName?: string
  lastName?: string
  email?: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
}

// Token management
const TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_KEY = 'auth_user'

export const tokenStorage = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(TOKEN_KEY)
  },
  
  setToken: (token: string): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(TOKEN_KEY, token)
  },
  
  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  },
  
  setRefreshToken: (token: string): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(REFRESH_TOKEN_KEY, token)
  },
  
  getUser: (): User | null => {
    if (typeof window === 'undefined') return null
    const userStr = localStorage.getItem(USER_KEY)
    if (!userStr) return null
    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  },
  
  setUser: (user: User): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },
  
  clear: (): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },
  
  setAll: (tokens: AuthTokens, user: User): void => {
    tokenStorage.setToken(tokens.accessToken)
    tokenStorage.setRefreshToken(tokens.refreshToken)
    tokenStorage.setUser(user)
  }
}

// API Functions
export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
    
    // Store tokens and user data
    tokenStorage.setAll(
      { accessToken: response.data.accessToken, refreshToken: response.data.refreshToken },
      response.data.user
    )
    
    return response.data
  } catch (error) {
    throw new Error(handleApiError(error))
  }
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  try {
    const response = await apiClient.post<AuthResponse>('/auth/register', data)
    
    // Store tokens and user data
    tokenStorage.setAll(
      { accessToken: response.data.accessToken, refreshToken: response.data.refreshToken },
      response.data.user
    )
    
    return response.data
  } catch (error) {
    throw new Error(handleApiError(error))
  }
}

export async function logout(): Promise<void> {
  try {
    await apiClient.post('/auth/logout')
  } catch (error) {
    // Ignore errors on logout - clear local state anyway
    console.error('Logout API error:', error)
  } finally {
    tokenStorage.clear()
  }
}

export async function getCurrentUser(): Promise<User> {
  try {
    const response = await apiClient.get<{ user: User }>('/auth/me')
    
    // Update stored user data
    tokenStorage.setUser(response.data.user)
    
    return response.data.user
  } catch (error) {
    throw new Error(handleApiError(error))
  }
}

export async function updateProfile(data: ProfileUpdateData): Promise<User> {
  try {
    const response = await apiClient.patch<{ message: string; user: User }>('/auth/profile', data)
    
    // Update stored user data
    tokenStorage.setUser(response.data.user)
    
    return response.data.user
  } catch (error) {
    throw new Error(handleApiError(error))
  }
}

export async function changePassword(data: ChangePasswordData): Promise<void> {
  try {
    await apiClient.post('/auth/change-password', data)
  } catch (error) {
    throw new Error(handleApiError(error))
  }
}

export async function refreshAccessToken(): Promise<AuthTokens> {
  try {
    const refreshToken = tokenStorage.getRefreshToken()
    if (!refreshToken) {
      throw new Error('No refresh token available')
    }
    
    const response = await apiClient.post<AuthTokens>('/auth/refresh-token', {
      refreshToken
    })
    
    // Update stored tokens
    tokenStorage.setToken(response.data.accessToken)
    tokenStorage.setRefreshToken(response.data.refreshToken)
    
    return response.data
  } catch (error) {
    // If refresh fails, clear all auth data
    tokenStorage.clear()
    throw new Error(handleApiError(error))
  }
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return !!tokenStorage.getToken()
}

// Get stored user without API call
export function getStoredUser(): User | null {
  return tokenStorage.getUser()
}
