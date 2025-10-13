import React, { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'

type AuthContextType = {
  user: any | null
  checked: boolean
  login: (email: string, password: string) => Promise<any>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    let mounted = true
    api.get('/auth/me')
      .then(res => { if (mounted) setUser(res.data.user) })
      .catch(() => { if (mounted) setUser(null) })
      .finally(() => { if (mounted) setChecked(true) })
    return () => { mounted = false }
  }, [])

  async function login(email: string, password: string) {
    const res = await api.post('/auth/login', { email, password })
    setUser(res.data.user)
    return res
  }

  async function logout() {
    try { await api.post('/auth/logout') } catch (e) {/* ignore */}
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, checked, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
