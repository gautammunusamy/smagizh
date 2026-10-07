import { Link } from 'react-router-dom'
import Logo from './Logo'
import { useData } from '../context/DataContext'
import { prettyPhone } from '../utils/format'
import {
  IconFacebook,
  IconInstagram,
  IconLinkedIn,
  IconMail,
  IconPhone,
  IconPin,
  IconShield,
  IconYouTube,
} from './Icons'

const Chevron = () => (
  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-brand-400" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m9 6 6 6-6 6" />
  </svg>
)

export default function Footer() {
  const { settings } = useData()
  const year = new Date().getFullYear()

  const explore = [
    { to: '/categories', label: 'Rental Categories' },
    { to: '/services', label: 'Marketing Services' },
    { to: '/plans', label: 'Monthly & Annual Plans' },
    { to: '/plans#faqs', label: 'FAQs' },
  ]
  const company = [
    { to: '/about', label: 'About Us' },
    { to: '/#why-us', label: 'Why Choose Us' },
    { to: '/how-it-works', label: 'How It Works' },
    { to: '/contact', label: 'Contact Us' },
  ]

  const socials = [
    { href: settings.social?.facebook, Icon: IconFacebook, label: 'Facebook' },
    { href: settings.social?.instagram, Icon: IconInstagram, label: 'Instagram' },
    { href: settings.social?.linkedin, Icon: IconLinkedIn, label: 'LinkedIn' },
    { href: settings.social?.youtube, Icon: IconYouTube, label: 'YouTube' },
  ].filter((s) => s.href)

  return (
    <footer className="mt-6 px-4 pb-8 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1240px] overflow-hidden rounded-3xl bg-ink text-white">
        <div className="grid gap-10 p-8 sm:grid-cols-2 sm:p-10 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr] lg:gap-8">
          <div>
            <Logo variant="dark" size="lg" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">{settings.description}</p>
            {socials.length > 0 && (
              <div className="mt-6 flex gap-2.5">
                {socials.map(({ href, Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="grid h-10 w-10 place-items-center rounded-full bg-white/5 text-brand-300 ring-1 ring-white/15 transition hover:bg-brand-gradient hover:text-white hover:ring-transparent"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            )}
          </div>

          <FooterCol title="Explore" links={explore} />
          <FooterCol title="Company" links={company} />

          <div>
            <FooterTitle>Get in touch</FooterTitle>
            <ul className="mt-5 space-y-3.5 text-sm text-white/70">
              <li className="flex items-start gap-3">
                <IconPhone className="mt-0.5 h-4 w-4 shrink-0 text-magenta-400" />
                <a className="hover:text-white" href={`tel:${String(settings.phone).replace(/\s/g, '')}`}>
                  {settings.phone || prettyPhone(settings.defaultWhatsapp)}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <IconMail className="mt-0.5 h-4 w-4 shrink-0 text-magenta-400" />
                <a className="break-all hover:text-white" href={`mailto:${settings.email}`}>
                  {settings.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <IconPin className="mt-0.5 h-4 w-4 shrink-0 text-magenta-400" />
                <span>{settings.city}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 px-8 py-6 sm:px-10">
          <div className="flex flex-col items-center justify-between gap-5 text-center lg:flex-row lg:text-left">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/5 text-brand-300 ring-1 ring-white/10">
                <IconShield />
              </span>
              <p className="text-sm">
                <span className="font-semibold text-white">
                  © {year} {settings.name}.
                </span>
                <span className="block text-white/50">All rights reserved.</span>
              </p>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-5 py-2.5 text-sm text-white/70 ring-1 ring-white/10">
              <IconShield className="h-4 w-4 text-brand-300" /> Your growth is our priority
            </span>
            <p className="text-sm text-white/50">
              Marketing results vary.
              <span className="block">Ad spend billed separately.</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

const FooterTitle = ({ children }) => (
  <h4 className="text-base font-bold text-white">
    {children}
    <span className="mt-2 block h-[3px] w-9 rounded-full bg-brand-gradient" />
  </h4>
)

function FooterCol({ title, links }) {
  return (
    <div>
      <FooterTitle>{title}</FooterTitle>
      <ul className="mt-5 space-y-3 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to} className="flex items-center gap-2 text-white/70 transition hover:text-white">
              <Chevron />
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
