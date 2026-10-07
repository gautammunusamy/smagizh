import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import Logo from './Logo'
import { IconClose, IconMenu } from './Icons'

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/categories', label: 'Categories' },
  { to: '/services', label: 'Services' },
  { to: '/plans', label: 'Plans' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => setOpen(false), [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const linkClass = ({ isActive }) =>
    `relative whitespace-nowrap py-2 text-sm font-medium transition ${
      isActive ? 'text-brand-700' : 'text-ink/70 hover:text-ink'
    } after:absolute after:inset-x-0 after:-bottom-[9px] after:h-[3px] after:rounded-full after:bg-brand-gradient after:transition-opacity ${
      isActive ? 'after:opacity-100' : 'after:opacity-0'
    }`

  return (
    <header
      className={`sticky top-0 z-40 border-b transition ${
        scrolled ? 'border-black/5 bg-white/90 shadow-[0_2px_18px_rgba(18,16,43,.06)] backdrop-blur' : 'border-transparent bg-white'
      }`}
    >
      <div className="container-x flex h-[72px] items-center justify-between gap-4">
        <Link to="/" aria-label="Smagizh Marketing - home" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-6 xl:flex" aria-label="Main">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={linkClass}>
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-black/10 text-ink xl:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      {/* mobile / tablet menu */}
      {open && (
        <div className="max-h-[calc(100vh-72px)] overflow-y-auto border-t border-black/5 bg-white xl:hidden">
          <nav className="container-x flex flex-col py-3" aria-label="Mobile">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-3 text-sm font-semibold ${
                    isActive ? 'bg-brand-50 text-brand-700' : 'text-ink/75 hover:bg-black/5'
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
