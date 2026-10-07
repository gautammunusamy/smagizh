import { useMemo, useState } from 'react'
import SectionHeading from '../components/SectionHeading'
import ConsultationForm from '../components/ConsultationForm'
import Logo from '../components/Logo'
import AppIcon, { IconTile } from '../components/AppIcon'
import { useData } from '../context/DataContext'
import { prettyPhone } from '../utils/format'
import { buildQuickMessage, whatsappLink } from '../utils/whatsapp'
import { IconCheck, IconWhatsApp } from '../components/Icons'

const SLOTS = ['10:00 AM', '11:30 AM', '2:00 PM', '3:30 PM', '5:00 PM']
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const TOPICS = ['Rental category and audience review', 'Google and Meta campaign planning', 'Google Business Profile and local SEO', 'WhatsApp enquiry routing and follow-up', 'Budget, plan and reporting guidance']

export default function Contact() {
  const { settings } = useData()
  const cards = [
    { icon: 'phone', color: 'violet', label: 'Call us', value: settings.phone, href: `tel:${String(settings.phone).replace(/\s/g, '')}` },
    { icon: 'whatsapp', color: 'green', label: 'WhatsApp', value: prettyPhone(settings.defaultWhatsapp), href: whatsappLink(settings.defaultWhatsapp, buildQuickMessage(settings.name)), external: true },
    { icon: 'mail', color: 'pink', label: 'Email', value: settings.email, href: `mailto:${settings.email}` },
    { icon: 'map-pin', color: 'rose', label: 'Address', value: settings.address || settings.city, href: settings.mapUrl, external: true },
    { icon: 'clock', color: 'amber', label: 'Business hours', value: settings.hours },
  ]

  return (
    <div className="pb-4">
      <section className="bg-hero-gradient py-12 sm:py-14">
        <div className="container-x">
          <SectionHeading
            as="h1"
            eyebrow="Contact"
            title="Let’s talk about your"
            highlight="rental business"
            subtitle="Tell us what you rent, where you operate and what you want to achieve."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {cards.map((c) => {
              const inner = (
                <>
                  <IconTile icon={c.icon} color={c.color} size="sm" />
                  <span className="min-w-0">
                    <span className="block text-xs font-semibold uppercase tracking-wide text-ink/45">{c.label}</span>
                    <span className="block break-words text-sm font-semibold">{c.value}</span>
                  </span>
                </>
              )
              return c.href ? (
                <a key={c.label} href={c.href} target={c.external ? '_blank' : undefined} rel="noreferrer" className="card card-hover flex items-center gap-3 p-4">
                  {inner}
                </a>
              ) : (
                <div key={c.label} className="card flex items-center gap-3 p-4">{inner}</div>
              )
            })}
          </div>
        </div>
      </section>

      <section id="consultation" className="container-x scroll-mt-24 py-12">
        <BookConsultation />
      </section>
    </div>
  )
}

function BookConsultation() {
  const { settings } = useData()
  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])
  const [month, setMonth] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [day, setDay] = useState(null)
  const [slot, setSlot] = useState('')

  const cells = useMemo(() => {
    const first = new Date(month)
    const lead = (first.getDay() + 6) % 7 // Monday-first
    const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
    return [...Array(lead).fill(null), ...Array.from({ length: days }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1))]
  }, [month])

  const available = (d) => d && d > today && d.getDay() !== 0
  const canPrev = month > new Date(today.getFullYear(), today.getMonth(), 1)
  const label = month.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
  const chosen =
    day && slot
      ? `Preferred consultation: ${day.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })} at ${slot} IST`
      : ''

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[1fr_1.1fr]">
      <div className="card overflow-hidden">
        <div className="border-b border-black/5 p-6">
          <Logo size="md" />
        </div>
        <div className="p-6">
          <p className="kicker">Book</p>
          <h2 className="mt-1 text-3xl font-extrabold tracking-tight">Book a Free Consultation</h2>
          <ul className="mt-4 space-y-2 text-sm text-ink/70">
            <li className="flex items-center gap-2"><AppIcon name="clock" className="h-5 w-5 text-brand-600" /> 30–45 min</li>
            <li className="flex items-center gap-2"><AppIcon name="phone" className="h-5 w-5 text-brand-600" /> Phone, WhatsApp or online meeting</li>
          </ul>
          <p className="mt-5 text-sm font-semibold">Learn how Smagizh can help your rental business with:</p>
          <ul className="mt-3 space-y-2">
            {TOPICS.map((t) => (
              <li key={t} className="flex items-start gap-2.5 text-sm text-ink/70">
                <IconCheck className="check" /> {t}
              </li>
            ))}
          </ul>
          <p className="muted mt-5 text-sm">Let’s discuss your rental category, goals and budget, and identify a practical promotion plan.</p>
        </div>

        <div className="border-t border-black/5 p-6">
          <div className="flex items-center justify-between">
            <p className="font-bold">Select a date &amp; time</p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={!canPrev}
                onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
                className="grid h-8 w-8 place-items-center rounded-full text-brand-700 hover:bg-brand-50 disabled:opacity-30"
                aria-label="Previous month"
              >
                ‹
              </button>
              <span className="w-36 text-center text-sm font-semibold">{label}</span>
              <button
                type="button"
                onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
                className="grid h-8 w-8 place-items-center rounded-full text-brand-700 hover:bg-brand-50"
                aria-label="Next month"
              >
                ›
              </button>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs">
            {WEEKDAYS.map((w) => (
              <span key={w} className="py-1 font-semibold text-ink/45">{w}</span>
            ))}
            {cells.map((d, i) => {
              const ok = available(d)
              const on = day && d && d.getTime() === day.getTime()
              return (
                <button
                  key={i}
                  type="button"
                  disabled={!ok}
                  onClick={() => setDay(d)}
                  className={`mx-auto grid aspect-square w-full max-w-[44px] place-items-center rounded-full text-sm transition ${
                    !d ? 'invisible' : on ? 'bg-brand-600 font-bold text-white' : ok ? 'bg-brand-50 font-semibold text-brand-700 hover:bg-brand-100' : 'text-ink/30'
                  }`}
                >
                  {d?.getDate()}
                </button>
              )
            })}
          </div>
          {day && (
            <div className="mt-5">
              <p className="text-xs font-semibold text-ink/55">Available times (IST)</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {SLOTS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSlot(s)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold ring-1 transition ${
                      slot === s ? 'bg-brand-600 text-white ring-brand-600' : 'bg-white text-ink/70 ring-black/10 hover:ring-brand-300'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card p-6 sm:p-8 lg:sticky lg:top-24">
        <ConsultationForm
          source="Contact page · consultation"
          extra={{
            value: chosen,
            node: (
              <p className={`mt-2 rounded-xl px-3 py-2 text-sm ${chosen ? 'bg-emerald-50 text-emerald-800' : 'bg-brand-50/70 text-ink/60'}`}>
                {chosen || 'Pick a date and time on the calendar, or just send your enquiry and we will suggest a slot.'}
              </p>
            ),
          }}
        />
        <a
          href={whatsappLink(settings.defaultWhatsapp, buildQuickMessage(settings.name))}
          target="_blank"
          rel="noreferrer"
          className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-emerald-700 hover:underline"
        >
          <IconWhatsApp className="h-4 w-4" /> Prefer to chat now? Message us on WhatsApp
        </a>
      </div>
    </div>
  )
}
