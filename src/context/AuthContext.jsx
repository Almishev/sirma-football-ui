import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { login as apiLogin, register as apiRegister, setAuthToken, clearAuthToken } from '../api/client'

const STORAGE_KEY = 'auth-token'

function decodeJwtPayload(token) {
  try {
    const base64 = token.split('.')[1]
    if (!base64) return null
    const json = atob(base64)
    return JSON.parse(json)
  } catch {
    return null
  }
}

export const AuthContext = createContext({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: true,
  login: async () => {},
  register: async () => {},
  loginWithToken: () => {},
  logout: () => {},
})

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => window.localStorage.getItem(STORAGE_KEY))
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      setAuthToken(token)
      const payload = decodeJwtPayload(token)
      if (payload) {
        const sub = payload.sub
        const roles = Array.isArray(payload.roles) ? payload.roles : []
        const email = payload.email ?? ''
        setUser({ username: sub, email, roles })
      } else {
        setUser({ username: 'user', email: '', roles: [] })
      }
    } else {
      clearAuthToken()
      setUser(null)
    }
    setLoading(false)
  }, [token])

  const login = useCallback(async (email, password) => {
    const data = await apiLogin(email, password)
    const t = data?.token
    if (t) {
      window.localStorage.setItem(STORAGE_KEY, t)
      setToken(t)
      if (data?.username != null) {
        setUser({ username: data.username, email: data.email ?? '', roles: data.roles ?? [] })
      }
      return data
    }
    throw new Error('Login failed')
  }, [])

  const register = useCallback(async (username, email, password) => {
    const data = await apiRegister(username, email, password)
    const t = data?.token
    if (t) {
      window.localStorage.setItem(STORAGE_KEY, t)
      setToken(t)
      if (data?.username != null) {
        setUser({ username: data.username, email: data.email ?? '', roles: data.roles ?? [] })
      }
      return data
    }
    throw new Error('Registration failed')
  }, [])

  const loginWithToken = useCallback((t) => {
    if (t) {
      window.localStorage.setItem(STORAGE_KEY, t)
      setToken(t)
      setAuthToken(t)
      const payload = decodeJwtPayload(t)
      if (payload) {
        const sub = payload.sub
        const roles = Array.isArray(payload.roles) ? payload.roles : []
        const email = payload.email ?? ''
        setUser({ username: sub, email, roles })
      } else {
        setUser({ username: 'user', email: '', roles: [] })
      }
    }
  }, [])

  const logout = useCallback(() => {
    window.localStorage.removeItem(STORAGE_KEY)
    clearAuthToken()
    setToken(null)
    setUser(null)
  }, [])

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    loading,
    login,
    register,
    loginWithToken,
    logout,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
