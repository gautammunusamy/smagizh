import { useState } from 'react'
import SectionHeading from './SectionHeading'
import AppIcon, { IconTile } from './AppIcon'
import { IconMinus, IconPlus } from './Icons'
import { CtaStrip } from './Sections'
import { useData } from '../context/DataContext'
import { FAQ_GROUPS } from '../data/seed'

/** Accordion FAQ (reference: "Clear answers for your rental business"). */
export default function FaqSection({ limit = 8 }) {
  const { activeFaqs } = useData()
  const items = activeFaqs.slice(0, limit)
  const [open, setOpen] = useState(() => new Set(items.slice(0, 2).map((f) => f.id)))

  if (items.length === 0) return null

  const toggle = (id) =>
    setOpen((s) => {
      const next = new Set(s)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  return (
    <section id="faqs" className="container-x section scroll-mt-24">
      <SectionHeading
        eyebrow="Frequently asked questions"
        title="Clear answers for your"
        highlight="rental business"
        subtitle="Understand our plans, promotion process and support before you get started."
      />
      <div className="mx-auto mt-10 max-w-4xl space-y-3">
        {items.map((f) => {
          const isOpen = open.has(f.id)
          return (
            <div key={f.id} className={`card transition ${isOpen ? 'border-brand-200' : ''}`}>
              <button
                type="button"
                className="flex w-full items-center gap-4 p-4 text-left sm:p-5"
                onClick={() => toggle(f.id)}
                aria-expanded={isOpen}
              >
                <IconTile icon={f.icon} color={f.color} size="sm" />
                <span className="flex-1 text-base font-bold leading-snug sm:text-lg">{f.question}</span>
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition ${
                    isOpen ? 'bg-brand-gradient text-white' : 'bg-brand-50 text-brand-700'
                  }`}
                >
                  {isOpen ? <IconMinus className="h-4 w-4" /> : <IconPlus className="h-4 w-4" />}
                </span>
              </button>
              {isOpen && (
                <p className="muted -mt-1 px-4 pb-5 text-sm leading-relaxed sm:pl-[84px] sm:pr-16">{f.answer}</p>
              )}
            </div>
          )
        })}
      </div>
      <CtaStrip
        className="mx-auto mt-5 max-w-4xl"
        icon="headset"
        title="Still have questions?"
        text="Talk to our team about your category, budget and goals."
        primary="View all FAQs"
        primaryTo="/plans#faqs"
      />
    </section>
  )
}

/** Two-column FAQ grid (reference: "Everything rental owners should know"). */
export function FaqGrid() {
  const { activeFaqs } = useData()
  const groups = FAQ_GROUPS.map((g) => ({ ...g, items: activeFaqs.filter((f) => (f.group || 'plans') === g.id) })).filter(
    (g) => g.items.length,
  )
  let n = 0
  return (
    <section id="faqs" className="container-x section scroll-mt-24">
      <SectionHeading
        eyebrow="Frequently asked questions"
        title="Everything"
        highlight="rental owners should know"
        subtitle="Plans, costs, account access and turning enquiries into bookings. Clear expectations before you begin."
      />
      <div className="mt-10 grid items-start gap-6 lg:grid-cols-2">
        {groups.map((g) => (
          <div key={g.id} className="rounded-3xl border border-brand-100 bg-brand-50/40 p-3 sm:p-4">
            <div className="flex items-center gap-3 px-2 py-2">
              <AppIcon name={g.icon} className="h-8 w-8 text-brand-600" />
              <div>
                <p className="kicker">{g.name}</p>
                <p className="muted text-sm">{g.sub}</p>
              </div>
            </div>
            <div className="mt-3 space-y-3">
              {g.items.map((f) => {
                n += 1
                return (
                  <div key={f.id} className="card flex gap-4 p-4 sm:p-5">
                    <div className="flex shrink-0 flex-col items-center gap-2">
                      <span className="text-xs font-bold text-brand-700">{String(n).padStart(2, '0')}</span>
                      <IconTile icon={f.icon} color={f.color} size="sm" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold leading-snug">{f.question}</h3>
                      <p className="muted mt-1.5 text-sm leading-relaxed">{f.answer}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      <CtaStrip
        className="mt-6"
        icon="headset"
        title="Still have questions?"
        text="Let us review your rental business."
        primary="Request a Consultation"
        primaryTo="/contact#consultation"
        note="Platform guidance informs these answers. Your signed service agreement confirms commercial terms."
      />
    </section>
  )
}
