const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

const wrap = (children, props) => (
  <svg viewBox="0 0 24 24" className={props.className || 'h-5 w-5'} {...base} aria-hidden="true">
    {children}
  </svg>
)

export const IconWhatsApp = ({ className = 'h-5 w-5' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.48 1.34 5L2 22l5.2-1.36a9.9 9.9 0 0 0 4.84 1.25h.01c5.5 0 9.96-4.46 9.96-9.96A9.9 9.9 0 0 0 19.09 4.9 9.9 9.9 0 0 0 12.04 2Zm0 18.18h-.01a8.25 8.25 0 0 1-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.22 8.22 0 0 1-1.26-4.36c0-4.55 3.71-8.26 8.27-8.26 2.2 0 4.28.86 5.84 2.42a8.2 8.2 0 0 1 2.42 5.85c0 4.56-3.71 8.21-8.27 8.21Zm4.53-6.15c-.25-.13-1.47-.72-1.7-.8-.23-.09-.39-.13-.56.12s-.64.8-.79.97c-.14.16-.29.18-.54.06a6.75 6.75 0 0 1-3.37-2.95c-.25-.43.25-.4.72-1.33.08-.16.04-.3-.02-.42-.06-.13-.56-1.35-.77-1.84-.2-.48-.41-.42-.56-.43h-.48c-.16 0-.42.06-.64.3-.22.25-.84.83-.84 2.02s.86 2.34.98 2.5c.12.17 1.7 2.6 4.12 3.64 1.53.66 2.13.72 2.9.6.46-.06 1.47-.6 1.68-1.18.2-.58.2-1.07.15-1.18-.06-.11-.22-.17-.47-.3Z" />
  </svg>
)

export const IconArrowRight = (p) => wrap(<><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>, p)
export const IconCheck = (p) => wrap(<path d="m5 13 4 4L19 7" />, p)
export const IconPlus = (p) => wrap(<><path d="M12 5v14" /><path d="M5 12h14" /></>, p)
export const IconMinus = (p) => wrap(<path d="M5 12h14" />, p)
export const IconClose = (p) => wrap(<><path d="M6 6 18 18" /><path d="M18 6 6 18" /></>, p)
export const IconMenu = (p) => wrap(<><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>, p)
export const IconUser = (p) => wrap(<><circle cx="12" cy="8" r="3.5" /><path d="M4.5 20a7.5 7.5 0 0 1 15 0" /></>, p)
export const IconUsers = (p) => wrap(<><circle cx="9" cy="8" r="3" /><path d="M2.5 19a6.5 6.5 0 0 1 13 0" /><path d="M16 5.5a3 3 0 0 1 0 5.8" /><path d="M18 19a6 6 0 0 0-2-4.3" /></>, p)
export const IconTarget = (p) => wrap(<><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="1" /></>, p)
export const IconChart = (p) => wrap(<><path d="M4 20h16" /><path d="M7 16v-5" /><path d="M12 16V6" /><path d="M17 16v-8" /></>, p)
export const IconPhone = (p) => wrap(<path d="M5 4h3l2 5-2 1a12 12 0 0 0 6 6l1-2 5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />, p)
export const IconMail = (p) => wrap(<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 7 8.5 6 8.5-6" /></>, p)
export const IconPin = (p) => wrap(<><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /></>, p)
export const IconClock = (p) => wrap(<><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>, p)
export const IconGrid = (p) => wrap(<><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></>, p)
export const IconTag = (p) => wrap(<><path d="M4 11.5V5a1 1 0 0 1 1-1h6.5L20 12.5 12.5 20 4 11.5Z" /><circle cx="8.5" cy="8.5" r="1.3" /></>, p)
export const IconSettings = (p) => wrap(<><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1 2 2 0 1 1-4 0 1.6 1.6 0 0 0-2.7-1.1l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 3.6 15a2 2 0 1 1 0-4 1.6 1.6 0 0 0 1.1-2.7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 10.2 4.4a2 2 0 1 1 4 0 1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1.1 2.7 2 2 0 1 1 0 4Z" /></>, p)
export const IconBox = (p) => wrap(<><path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z" /><path d="m4 7 8 4 8-4" /><path d="M12 11v10" /></>, p)
export const IconChat = (p) => wrap(<path d="M20 15a3 3 0 0 1-3 3H8l-4 3V6a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3Z" />, p)
export const IconHelp = (p) => wrap(<><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-.9.8-.9 1.5v.2" /><path d="M12 17h.01" /></>, p)
export const IconLogout = (p) => wrap(<><path d="M15 12H4" /><path d="m8 8-4 4 4 4" /><path d="M10 4h7a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-7" /></>, p)
export const IconWallet = (p) => wrap(<><path d="M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2" /><path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3" /><path d="M21 10h-4a2 2 0 0 0 0 4h4v-4Z" /></>, p)
export const IconRoute = (p) => wrap(<><circle cx="6" cy="6" r="2.5" /><circle cx="18" cy="18" r="2.5" /><path d="M8.5 6H14a4 4 0 0 1 0 8h-4a4 4 0 0 0 0 8h5.5" /></>, p)
export const IconEdit = (p) => wrap(<><path d="M4 20h4L19 9a2.1 2.1 0 0 0-3-3L5 17v3Z" /><path d="M15 6l3 3" /></>, p)
export const IconTrash = (p) => wrap(<><path d="M4 7h16" /><path d="M9 7V5h6v2" /><path d="M6 7l1 13h10l1-13" /></>, p)
export const IconSave = (p) => wrap(<><path d="M5 4h11l4 4v12H5Z" /><path d="M8 4v6h7V4" /><rect x="8" y="14" width="8" height="6" /></>, p)
export const IconUp = (p) => wrap(<path d="m6 15 6-6 6 6" />, p)
export const IconDown = (p) => wrap(<path d="m6 9 6 6 6-6" />, p)
export const IconSearch = (p) => wrap(<><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" /></>, p)
export const IconShield = (p) => wrap(<><path d="M12 3 5 6v6c0 4.4 3 7.7 7 9 4-1.3 7-4.6 7-9V6l-7-3Z" /><path d="m9 12 2 2 4-4" /></>, p)
export const IconBolt = (p) => wrap(<path d="M13 3 5 14h6l-1 7 8-11h-6l1-7Z" />, p)
export const IconRocket = (p) => wrap(<><path d="M14 4c3.5 0 6 2.5 6 6-2.5 5-6 8-11 10l-1.5-3.5L4 15C6 10 9 6.5 14 4Z" /><circle cx="14.5" cy="9.5" r="1.5" /></>, p)
export const IconDoc = (p) => wrap(<><path d="M6 3h8l4 4v14H6Z" /><path d="M14 3v4h4" /><path d="M9 12h6" /><path d="M9 16h6" /></>, p)
export const IconEyeOff = (p) => wrap(<><path d="M3 3l18 18" /><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" /><path d="M9.4 5.3A9.7 9.7 0 0 1 12 5c5 0 9 4.5 9 7a11 11 0 0 1-2.3 3.4M6.3 6.9C4.2 8.3 3 10.3 3 12c0 2.5 4 7 9 7 1.2 0 2.3-.2 3.3-.6" /></>, p)
export const IconExternal = (p) => wrap(<><path d="M14 4h6v6" /><path d="M20 4 11 13" /><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" /></>, p)
export const IconStar = (p) => wrap(<path d="m12 4 2.4 5 5.6.7-4 3.9 1 5.4-5-2.7-5 2.7 1-5.4-4-3.9 5.6-.7Z" />, p)
export const IconQuote = (p) => (
  <svg viewBox="0 0 24 24" className={p.className || 'h-5 w-5'} fill="currentColor" aria-hidden="true">
    <path d="M9.5 6C6.5 7.4 5 9.9 5 13.4V18h5.4v-5.2H8.2c0-2 .7-3.4 2.3-4.4L9.5 6Zm8.6 0c-3 1.4-4.5 3.9-4.5 7.4V18H19v-5.2h-2.2c0-2 .7-3.4 2.3-4.4L18.1 6Z" />
  </svg>
)
export const IconFacebook = ({ className = 'h-4 w-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true"><path d="M13.5 21v-8h2.7l.4-3h-3.1V8.2c0-.9.3-1.5 1.6-1.5h1.6V4.1A22 22 0 0 0 14.4 4C12 4 10.5 5.4 10.5 8v2H8v3h2.5v8h3Z" /></svg>
)
export const IconInstagram = ({ className = 'h-4 w-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5" /><circle cx="12" cy="12" r="3.8" /><circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" /></svg>
)
export const IconLinkedIn = ({ className = 'h-4 w-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true"><path d="M6.9 8.5H4V20h2.9V8.5ZM5.4 4a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4ZM20 13.6c0-3.2-1.7-4.7-4-4.7-1.8 0-2.6 1-3.1 1.7V8.5H10V20h2.9v-6.3c0-1.4.8-2.2 1.9-2.2s1.8.7 1.8 2.2V20H20v-6.4Z" /></svg>
)
export const IconYouTube = ({ className = 'h-4 w-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true"><path d="M21.5 8.2a2.6 2.6 0 0 0-1.8-1.8C18 6 12 6 12 6s-6 0-7.7.4A2.6 2.6 0 0 0 2.5 8.2 27 27 0 0 0 2.1 12c0 1.3.1 2.6.4 3.8a2.6 2.6 0 0 0 1.8 1.8C6 18 12 18 12 18s6 0 7.7-.4a2.6 2.6 0 0 0 1.8-1.8c.3-1.2.4-2.5.4-3.8s-.1-2.6-.4-3.8ZM10.2 14.6V9.4L14.7 12l-4.5 2.6Z" /></svg>
)

export const StatIcon = ({ name, className }) => {
  const map = { users: IconUsers, target: IconTarget, chart: IconChart }
  const C = map[name] || IconChart
  return <C className={className} />
}
