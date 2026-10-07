import { Link } from 'react-router-dom'
import AppIcon, { IconTile } from './AppIcon'
import { IconArrowRight, IconWhatsApp } from './Icons'
import { useData } from '../context/DataContext'
import { useEnquiry } from '../context/EnquiryContext'
import { buildEnquiryMessage, buildQuickMessage, resolveWhatsappNumber, whatsappLink } from '../utils/whatsapp'

/** Light call-to-action strip: title + gradient button + WhatsApp button. */
export function CtaStrip({
  title,
  text,
  primary = 'Find My Marketing Plan',
  onPrimary,
  primaryTo,
  whatsappLabel = 'Chat on WhatsApp',
  category = null,
  service = null,
  icon = 'message',
  note,
  className = '',
}) {
  const { settings } = useData()
  const { openEnquiry } = useEnquiry()
  const number = resolveWhatsappNumber(category, settings, service)
  const href = whatsappLink(number, buildQuickMessage(settings.name, category?.name, service?.name))
  const primaryCls = 'btn-primary px-6 py-3'
  return (
    <div className={`rounded-3xl border border-brand-100 bg-gradient-to-r from-brand-50 via-white to-fuchsia-50 p-5 sm:p-7 ${className}`}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <span className="hidden h-14 w-14 shrink-0 place-items-center rounded-full bg-white text-brand-600 shadow-card sm:grid">
            <AppIcon name={icon} className="h-7 w-7" />
          </span>
          <div>
            <h3 className="text-xl font-extrabold tracking-tight sm:text-2xl">{title}</h3>
            {text && <p className="muted mt-1 text-sm sm:text-base">{text}</p>}
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          {primaryTo ? (
            <Link to={primaryTo} className={primaryCls}>
              {primary} <IconArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <button
              type="button"
              className={primaryCls}
              onClick={onPrimary || (() => openEnquiry({ category, service: service?.name || '' }))}
            >
              {primary} <IconArrowRight className="h-4 w-4" />
            </button>
          )}
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="btn border-2 border-[#25D366] bg-white px-6 py-2.5 text-[#128C4A] hover:bg-emerald-50"
          >
            <IconWhatsApp className="h-5 w-5 text-[#25D366]" /> {whatsappLabel}
          </a>
        </div>
      </div>
      {note && <p className="mt-4 text-center text-xs text-ink/45">{note}</p>}
    </div>
  )
}

/** Dark closing banner used above the footer (reference: "Ready to grow your rental business?"). */
export function CtaBanner() {
  const { settings } = useData()
  const { openEnquiry } = useEnquiry()
  return (
    <section className="container-x pt-6">
      <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-12 text-center text-white sm:px-12 sm:py-16">
        <span className="pointer-events-none absolute -left-16 -top-16 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl" />
        <span className="pointer-events-none absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-magenta-500/25 blur-3xl" />
        <div className="relative">
          <span className="inline-flex rounded-full border border-brand-400/60 px-5 py-1.5 text-[11px] font-semibold uppercase tracking-[.25em] text-white/80">
            Rental business growth
          </span>
          <h2 className="h2 mt-6">
            Ready to grow your <span className="bg-gradient-to-r from-brand-300 to-magenta-400 bg-clip-text text-transparent">rental business?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/65 sm:text-lg">
            Reach more local customers with a marketing plan built around your rentals, location and budget.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button type="button" onClick={() => openEnquiry()} className="btn-primary px-7 py-3 text-base">
              Request My Marketing Plan <IconArrowRight className="h-4 w-4" />
            </button>
            <a
              href={whatsappLink(settings.defaultWhatsapp, buildQuickMessage(settings.name))}
              target="_blank"
              rel="noreferrer"
              className="btn-whatsapp px-7 py-3 text-base"
            >
              <IconWhatsApp /> Chat on WhatsApp
            </a>
          </div>
          <p className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-white/60">
            <span>Share your goals</span>
            <span className="text-brand-400">•</span>
            <span>Discuss your budget</span>
            <span className="text-brand-400">•</span>
            <span>Plan your promotion</span>
          </p>
        </div>
      </div>
    </section>
  )
}

const FLOW = [
  { icon: 'apps', color: 'violet', title: 'Choose your rental category', text: 'Select the rentals you want to promote.' },
  { icon: 'file', color: 'pink', title: 'Explore a plan or service', text: 'Choose an option that fits your goals, or ask for guidance.' },
  { icon: 'user', color: 'blue', title: 'Share your business details', text: 'Add your business name, service area and requirements.' },
  { icon: 'whatsapp', color: 'green', title: 'Open your WhatsApp chat', text: 'Connect to the category contact or our main business number.' },
  { icon: 'send', color: 'indigo', title: 'Review and tap Send', text: 'Your details appear in a draft message. You send it yourself.' },
  { icon: 'message', color: 'orange', title: 'Discuss your next steps', text: 'Our representative reviews your enquiry and helps define the scope.' },
]

/** "How enquiries work" with a live example of the pre-filled WhatsApp message. */
export function EnquiryFlow() {
  const { settings, activeCategories, activePlans, activeServices } = useData()
  const { openEnquiry } = useEnquiry()
  const cat = activeCategories[0]
  const plan = activePlans.find((p) => p.recommended) || activePlans[0]
  const svc = activeServices[0]
  const example = buildEnquiryMessage(
    {
      name: '[Your name]',
      business: '[Your business name]',
      category: cat?.name,
      plan: plan?.name,
      service: svc?.name,
      location: 'Chennai',
      notes: 'Weekend promotion',
    },
    settings.name,
  )
  const href = whatsappLink(resolveWhatsappNumber(cat, settings), buildQuickMessage(settings.name, cat?.name))

  return (
    <section id="enquiry-flow" className="container-x section scroll-mt-24">
      <div className="card grid gap-8 overflow-hidden p-5 sm:p-8 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <span className="eyebrow">How enquiries work</span>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl">Connect with the right rental marketing team</h2>
          <p className="muted mt-2 text-sm sm:text-base">
            Tell us about your business. Review your message, then start a conversation with {settings.shortName || 'Smagizh'}.
          </p>
          <ol className="mt-6 space-y-4">
            {FLOW.map((s, i) => (
              <li key={s.title} className="flex items-start gap-3 sm:gap-4">
                <span className="step-num h-9 w-9 text-xs">{String(i + 1).padStart(2, '0')}</span>
                <IconTile icon={s.icon} color={s.color} size="xs" className="hidden sm:grid" />
                <div className="min-w-0">
                  <p className="font-bold leading-snug">{s.title}</p>
                  <p className="muted text-sm">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-col rounded-3xl bg-ink p-5 text-white sm:p-7">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-bold uppercase tracking-[.2em] text-white/85">Your WhatsApp message</p>
            <span className="rounded-full bg-brand-200 px-3 py-1 text-[11px] font-semibold text-brand-800">Example preview</span>
          </div>
          <pre className="mt-5 flex-1 whitespace-pre-wrap break-words rounded-2xl border border-white/10 bg-white/[.06] p-4 font-sans text-sm leading-relaxed text-white/85 sm:p-5">
            {example}
          </pre>
          <p className="mt-4 text-sm text-brand-200">Review your details in WhatsApp and tap Send.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button type="button" className="btn-primary py-3" onClick={() => openEnquiry()}>
              Open Enquiry Form <IconArrowRight className="h-4 w-4" />
            </button>
            <a href={href} target="_blank" rel="noreferrer" className="btn-whatsapp py-3">
              <IconWhatsApp /> Continue to WhatsApp
            </a>
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-col items-start justify-between gap-2 rounded-2xl bg-brand-50/70 px-5 py-3.5 text-sm sm:flex-row sm:items-center">
        <span className="flex items-center gap-2">
          <AppIcon name="mail" className="h-5 w-5 text-magenta-500" />
          <span className="font-semibold">Prefer email?</span>
          <a href={`mailto:${settings.email}`} className="break-all font-semibold text-brand-700 hover:underline">
            {settings.email}
          </a>
        </span>
        <span className="text-ink/55">
          {settings.shortName || 'Smagizh'} • {settings.tagline}
        </span>
      </div>
    </section>
  )
}

/** Small bordered notice (disclaimers under plans / pages). */
export function Notice({ icon = 'bolt', tone = 'brand', children, className = '' }) {
  const tones = {
    brand: 'border-brand-100 bg-white text-ink/60 [&_svg]:text-brand-600',
    amber: 'border-amber-100 bg-amber-50/60 text-ink/65 [&_svg]:text-amber-500',
  }
  return (
    <p className={`flex items-start gap-2.5 rounded-xl border px-4 py-2.5 text-xs leading-relaxed sm:items-center ${tones[tone]} ${className}`}>
      <AppIcon name={icon} className="h-4 w-4 shrink-0" />
      <span>{children}</span>
    </p>
  )
}
