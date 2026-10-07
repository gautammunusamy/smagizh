import { useState } from 'react'
import { Link, NavLink, Navigate, Outlet, useNavigate } from 'react-router-dom'
import Logo from '../components/Logo'
import { useAuth } from '../context/AuthContext'
import {
  IconBox,
  IconChart,
  IconChat,
  IconClose,
  IconExternal,
  IconGrid,
  IconHelp,
  IconLogout,
  IconMenu,
  IconRocket,
  IconRoute,
  IconWallet,
  IconSettings,
  IconTag,
} from '../components/Icons'

const LINKS = [
  { to: '/admin', label: 'Dashboard', Icon: IconGrid, end: true },
  { to: '/admin/categories', label: 'Categories', Icon: IconTag },
  { to: '/admin/services', label: 'Services', Icon: IconBox },
  { to: '/admin/plans', label: 'Plans', Icon: IconChart },
  { to: '/admin/enquiries', label: 'Enquiries', Icon: IconChat },
  { to: '/admin/payments', label: 'Payments', Icon: IconWallet },
  { to: '/admin/whatsapp-routing', label: 'WhatsApp Routing', Icon: IconRoute },
  { to: '/admin/faqs', label: 'FAQs', Icon: IconHelp },
  { to: '/admin/settings', label: 'Settings', Icon: IconSettings },
]

export default function AdminLayout() {
  const { user, checking, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  // Wait for the session check, otherwise a refresh bounces a signed-in admin to the login screen.
  if (checking) return <div className="grid min-h-screen place-items-center text-sm text-ink/45">Loading…</div>
  if (!user) return <Navigate to="/admin/login" replace />

  const onLogout = async () => {
    await logout()
    navigate('/admin/login', { replace: true })
  }

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 px-4">
      {LINKS.map(({ to, label, Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={() => setOpen(false)}
          className={({ isActive }) => `admin-link ${isActive ? 'admin-link-active' : ''}`}
        >
          <Icon className="h-[18px] w-[18px]" />
          {label}
        </NavLink>
      ))}

      <button type="button" onClick={onLogout} className="admin-link mt-2 border-t border-white/10 pt-4">
        <IconLogout className="h-[18px] w-[18px]" />
        Log Out
      </button>
    </nav>
  )

  return (
    <div className="min-h-screen bg-mist lg:flex">
      {/* sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] flex-col bg-ink py-6 lg:flex">
        <Link to="/admin" className="mb-8 block px-5">
          <Logo variant="dark" size="sm" />
        </Link>
        {nav}
        <div className="mx-4 mt-6 rounded-2xl bg-white/[.04] p-5 text-center ring-1 ring-white/10">
          <IconRocket className="mx-auto h-7 w-7 text-brand-300" />
          <p className="mt-2 text-sm font-bold text-white">Grow your rental business with us</p>
          <p className="mt-2 text-xs leading-relaxed text-white/50">
            Targeted marketing. Verified leads. Better bookings.
          </p>
          <Link to="/" target="_blank" className="btn-outline btn-sm mt-4 w-full border-white/20 bg-transparent text-white hover:bg-white/10">
            View Site <IconExternal className="h-3.5 w-3.5" />
          </Link>
        </div>
      </aside>

      {/* mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/60" onClick={() => setOpen(false)} />
          <div className="relative flex h-full w-[260px] flex-col bg-ink py-6">
            <div className="mb-8 flex items-center justify-between px-6">
              <Logo variant="dark" size="sm" />
              <button type="button" onClick={() => setOpen(false)} className="text-white/60" aria-label="Close menu">
                <IconClose />
              </button>
            </div>
            {nav}
          </div>
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col lg:ml-[248px]">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-black/5 bg-white/90 px-4 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-black/10"
            aria-label="Open menu"
          >
            <IconMenu />
          </button>
          <Logo size="sm" showTagline={false} />
          <Link to="/" className="btn-outline btn-sm">
            Site
          </Link>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

/** Shared page header used by every admin screen. */
export function AdminPageHeader({ title, subtitle, children }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-[28px]">{title}</h1>
        {subtitle && <p className="muted mt-1 text-sm">{subtitle}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  )
}
