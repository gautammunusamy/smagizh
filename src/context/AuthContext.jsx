import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { api } from '../api/client'
import { useData } from './DataContext'

/**
 * Admin session, held by the PHP backend.
 *
 * The password is verified server-side against a bcrypt hash in MySQL and the
 * browser only ever holds an HttpOnly session cookie - nothing sensitive
 * ships in the JavaScript bundle.
 */

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const { reload } = useData()
  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)

  // Restore an existing session on first load.
  useEffect(() => {
    let alive = true
    api
      .me()
      .then((res) => alive && setUser(res.user || null))
      .catch(() => alive && setUser(null))
      .finally(() => alive && setChecking(false))
    return () => {
      alive = false
    }
  }, [])

  const login = useCallback(async (username, password) => {
    try {
      const res = await api.login(username, password)
      setUser(res.user || null)
      // A signed-in admin gets more from content.php - the enquiries and the
      // items hidden from the public site - so fetch the content again.
      await reload()
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e.message }
    }
  }, [reload])

  const logout = useCallback(async () => {
    try {
      await api.logout()
    } finally {
      setUser(null)
      // Drop the admin-only data (enquiries, hidden items) from memory.
      reload()
    }
  }, [reload])

  const changePassword = useCallback(async (current, next) => {
    try {
      await api.changePassword(current, next)
      return { ok: true }
    } catch (e) {
      return { ok: false, error: e.message }
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, checking, login, logout, changePassword }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
