import SectionHeading from '../components/SectionHeading'
import { PricingCard } from '../components/PlanCard'
import { FaqGrid } from '../components/FaqSection'
import AppIcon, { IconTile } from '../components/AppIcon'
import { useData } from '../context/DataContext'
import { useEnquiry } from '../context/EnquiryContext'
import { usePayment } from '../context/PaymentContext'
import { TRIAL_POINTS } from '../data/seed'
import { rupees } from '../utils/format'
import { buildQuickMessage, whatsappLink } from '../utils/whatsapp'
import { IconArrowRight, IconCheck, IconWhatsApp } from '../components/Icons'

export default function Plans() {
  const { activePlans, comparison, settings } = useData()
  const { openEnquiry } = useEnquiry()
  const { canPay, startCheckout } = usePayment()
  const monthly = Number(settings.monthlyDiscount ?? 5)
  const annual = Number(settings.annualDiscount ?? 20)
  // every active plan gets a column, Free included
  const compared = activePlans
  const trialPoints = settings.trialPoints?.length ? settings.trialPoints : TRIAL_POINTS
  const pricingNotes = settings.pricingNotes?.length ? settings.pricingNotes : []

  // Paid plans open Razorpay checkout; the free plan (and any plan without an
  // online price) falls back to the enquiry form.
  const choose = (plan, billing = 'monthly') => {
    if (canPay(plan, billing) && startCheckout(plan, billing)) return
    const label = billing === 'annual' ? `${plan.name} (Annual)` : billing === 'monthly' ? `${plan.name} (Monthly)` : plan.name
    openEnquiry({ plan: label })
  }

  return (
    <div className="pb-4">
      <section className="bg-hero-gradient py-12 sm:py-14">
        <div className="container-x">
          <SectionHeading
            as="h1"
            eyebrow="Professional plans"
            title="Choose your plan."
            highlight="Save as you grow."
            subtitle="Monthly flexibility or annual savings for your rental business."
          />
          <div className="mx-auto mt-6 flex max-w-2xl flex-col justify-center gap-3 sm:flex-row">
            <span className="card flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium">
              <AppIcon name="calendar" className="h-5 w-5 text-brand-600" /> Monthly billing –{' '}
              <span className="font-bold text-magenta-500">Save {monthly}%</span>
            </span>
            <span className="card flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium">
              <AppIcon name="tag" className="h-5 w-5 text-emerald-600" /> Annual upfront –{' '}
              <span className="font-bold text-magenta-500">Save {annual}%</span>
            </span>
          </div>
          <p className="muted mt-4 text-center text-sm">
            Discounts are calculated from the standard plans below and cannot be combined.
          </p>
        </div>
      </section>

      <section className="container-x py-12">
        <div className={`grid gap-x-5 gap-y-3 pt-3 sm:grid-cols-2 ${activePlans.length >= 4 ? 'xl:grid-cols-4' : 'lg:grid-cols-3'}`}>
          {activePlans.map((p) => (
            <PricingCard key={p.id} plan={p} monthlyPct={monthly} annualPct={annual} trialPoints={trialPoints} onChoose={choose} />
          ))}
        </div>

        <div className="card mt-6 flex flex-col gap-5 p-6 md:flex-row md:items-center">
          <div className="flex shrink-0 items-center gap-4">
            <IconTile icon="shield" color="violet" size="lg" />
            <p className="text-xl font-extrabold leading-tight">
              Clear pricing.
              <br />
              No surprises.
            </p>
          </div>
          <ul className="space-y-2 md:border-l md:border-black/5 md:pl-6">
            {pricingNotes.map((t) => (
              <li key={t} className="flex items-start gap-2.5 text-sm text-ink/70">
                <IconCheck className="check" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-4 text-center text-xs text-ink/50">
          {settings.pricingFootnote}
        </p>

        <h2 className="mt-8 text-center text-lg font-bold">Need help choosing?</h2>
        <div className="mx-auto mt-4 grid max-w-3xl gap-4 sm:grid-cols-2">
          <button type="button" onClick={() => openEnquiry()} className="card card-hover flex items-center gap-4 border-brand-100 p-5 text-left">
            <IconTile icon="file" color="violet" size="lg" />
            <span className="min-w-0 flex-1">
              <span className="block text-base font-bold text-brand-700">Submit Enquiry</span>
              <span className="muted text-sm">Get a personalised recommendation</span>
            </span>
            <IconArrowRight className="h-5 w-5 shrink-0 text-brand-600" />
          </button>
          <a
            href={whatsappLink(settings.defaultWhatsapp, buildQuickMessage(settings.name))}
            target="_blank"
            rel="noreferrer"
            className="card card-hover flex items-center gap-4 border-emerald-100 p-5"
          >
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-[#25D366] text-white">
              <IconWhatsApp className="h-8 w-8" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-base font-bold text-emerald-700">Chat on WhatsApp</span>
              <span className="muted text-sm">Instant expert help from our team</span>
            </span>
            <IconArrowRight className="h-5 w-5 shrink-0 text-emerald-600" />
          </a>
        </div>
      </section>

      {/* comparison */}
      {compared.length > 0 && comparison.length > 0 && (
        <section id="compare" className="container-x scroll-mt-24 pb-6">
          <SectionHeading
            eyebrow="Proposed plan comparison"
            title="Find the right support for"
            highlight="your rental business"
            subtitle="Compare campaign scope, ongoing support and reporting in one place."
          />
          <div className="card mt-8 overflow-hidden">
            <div className="scroll-thin overflow-x-auto">
              <table className="w-full min-w-[880px] text-sm">
                <thead>
                  <tr className="border-b border-black/5">
                    <th className="w-[28%] px-5 py-5 text-left text-base font-bold">Feature</th>
                    {compared.map((p) => (
                      <th key={p.id} className={`px-4 py-5 text-center ${p.recommended ? 'bg-brand-50/70' : ''}`}>
                        {p.recommended && (
                          <span className="mb-2 inline-block rounded-full bg-brand-gradient px-3 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                            For regular promotion
                          </span>
                        )}
                        <span className="flex flex-col items-center gap-2">
                          <IconTile icon={p.icon} color={p.color} size="sm" shape="circle" />
                          <span className="text-base font-bold">{p.name}</span>
                          <span className="text-xs font-normal text-ink/55">{p.tagline}</span>
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-black/5">
                    <td className="px-5 py-3.5 font-bold">Base monthly service fee</td>
                    {compared.map((p) => (
                      <td key={p.id} className={`px-4 py-3.5 text-center text-xl font-extrabold text-brand-700 ${p.recommended ? 'bg-brand-50/70' : ''}`}>
                        {rupees(p.price)}
                      </td>
                    ))}
                  </tr>
                  {comparison.map((row) => (
                    <tr key={row.id} className="border-b border-black/5 last:border-0">
                      <td className="px-5 py-3 text-ink/75">{row.label}</td>
                      {compared.map((p) => (
                        <td key={p.id} className={`px-4 py-3 text-center text-ink/80 ${p.recommended ? 'bg-brand-50/70' : ''}`}>
                          {row.values?.[p.id] || '—'}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <td />
                    {compared.map((p) => (
                      <td key={p.id} className={`px-4 py-5 text-center ${p.recommended ? 'bg-brand-50/70' : ''}`}>
                        <button
                          type="button"
                          className={p.recommended ? 'btn-primary w-full' : 'btn-outline w-full'}
                          onClick={() => choose(p)}
                        >
                          {p.free ? 'Start free' : `Choose ${p.short || p.name}`}
                        </button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="border-t border-black/5 px-6 py-4 text-center text-xs leading-relaxed text-ink/50">
              Proposed scope—confirm deliverables before purchase. Ad spend, applicable taxes and third-party charges are separate.
              Booking reports depend on owner updates. Results and bookings are not guaranteed.
            </p>
          </div>

        </section>
      )}

      <FaqGrid />
    </div>
  )
}
