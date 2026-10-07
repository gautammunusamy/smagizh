import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'

export default function AdminLogin() {
  const { user, checking, login } = useAuth()
  const { settings } = useData()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (checking) return <div className="grid min-h-screen place-items-center bg-ink text-sm text-white/50">Loading…</div>
  if (user) return <Navigate to="/admin" replace />

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    const res = await login(form.username, form.password)
    setBusy(false)
    if (!res.ok) return setError(res.error)
    navigate('/admin', { replace: true })
  }

  return (
    <div className="relative grid min-h-screen place-items-center bg-ink p-4">
      <span className="pointer-events-none absolute -left-24 top-10 h-80 w-80 rounded-full bg-brand-600/25 blur-3xl" />
      <span className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-magenta-500/20 blur-3xl" />

      <div className="relative w-full max-w-sm">
        <div className="rounded-3xl bg-white p-7 shadow-pop">
          <Logo size="md" />
          <p className="muted mt-4 text-sm">Sign in to the {settings.name} Admin Panel</p>

          <form className="mt-6 space-y-4" onSubmit={submit}>
            <label className="block">
              <span className="label">Username or Email</span>
              <input
                className="field"
                value={form.username}
                onChange={(e) => {
                  setForm((f) => ({ ...f, username: e.target.value }))
                  setError('')
                }}
                autoComplete="username"
                placeholder="Username"
                autoFocus
              />
            </label>
            <label className="block">
              <span className="label">Password</span>
              <input
                className="field"
                type="password"
                value={form.password}
                onChange={(e) => {
                  setForm((f) => ({ ...f, password: e.target.value }))
                  setError('')
                }}
                autoComplete="current-password"
                placeholder="Password"
              />
            </label>

            {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

            <button type="submit" className="btn-primary w-full py-3" disabled={busy}>
              {busy ? 'Signing in…' : 'Log In'}
            </button>
          </form>

          <p className="mt-5 rounded-xl bg-brand-50 p-3 text-xs leading-relaxed text-brand-800">
            Authorised access only. Content edited here updates the public website immediately.
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-white/60 transition hover:text-white">
            ← Back to website
          </Link>
        </div>
      </div>
    </div>
  )
}
