import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { apiClient } from '@/services/api'

interface User {
  userId: string
  email: string
  name: string
  role: 'ADMIN' | 'FACULTY' | 'STUDENT'
  orgId: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithOtp: (identifier: string, otp: string) => Promise<void>
  joinBatch: (joinCode: string, name: string, contact: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Restore session from sessionStorage on mount
  useEffect(() => {
    const savedToken = sessionStorage.getItem('lms_token')
    const savedUser = sessionStorage.getItem('lms_user')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`
    }
    setIsLoading(false)
  }, [])

  const persistSession = useCallback((token: string, user: User) => {
    setToken(token)
    setUser(user)
    sessionStorage.setItem('lms_token', token)
    sessionStorage.setItem('lms_user', JSON.stringify(user))
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }, [])

  // Email + Password login (faculty/admin)
  const login = useCallback(async (email: string, password: string) => {
    const response = await apiClient.post('/api/auth/login', { email, password })
    const { token, user } = response.data
    persistSession(token, user)
  }, [persistSession])

  // OTP login (returning students)
  const loginWithOtp = useCallback(async (identifier: string, otp: string) => {
    const response = await apiClient.post('/api/auth/otp/verify', { identifier, otp })
    const { token, user } = response.data
    persistSession(token, user)
  }, [persistSession])

  // Join batch via code (new students)
  const joinBatch = useCallback(async (joinCode: string, name: string, contact: string) => {
    const response = await apiClient.post('/api/auth/join', { joinCode, name, contact })
    const { token, user } = response.data
    persistSession(token, user)
  }, [persistSession])

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    sessionStorage.removeItem('lms_token')
    sessionStorage.removeItem('lms_user')
    delete apiClient.defaults.headers.common['Authorization']
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, loginWithOtp, joinBatch, logout }}>
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
