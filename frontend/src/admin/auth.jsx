import { createContext, useContext, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { api, tokenStore } from '../lib/api'
import { Spinner } from './ui'
const Ctx = createContext(null)
export const useAuth = () => useContext(Ctx)
export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(!!tokenStore.get())
  useEffect(() => { if (!tokenStore.get()) return; api.get('/auth/me').then(r => setAdmin(r.data)).catch(() => tokenStore.clear()).finally(() => setLoading(false)) }, [])
  const login = async (email, password) => { const r = await api.post('/auth/login', { email, password }); tokenStore.set(r.data.access_token); setAdmin((await api.get('/auth/me')).data) }
  const logout = () => { tokenStore.clear(); setAdmin(null) }
  return <Ctx.Provider value={{ admin, setAdmin, loading, login, logout }}>{children}</Ctx.Provider>
}
export function Protected({ children }) {
  const { admin, loading } = useAuth()
  if (loading) return <Spinner full />
  return admin ? children : <Navigate to="/admin/login" replace />
}
