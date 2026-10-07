import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PlanCard from '../components/PlanCard'
import AppIcon, { CategoryArt, IconTile } from '../components/AppIcon'
import { useData } from '../context/DataContext'
import { usePayment } from '../context/PaymentContext'
import { buildEnquiryMessage, buildQuickMessage, resolveWhatsappNumber, whatsappLink } from '../utils/whatsapp'
import { prettyPhone } from '../utils/format'
import { BUDGET_OPTIONS, GOAL_OPTIONS, NEXT_STEPS } from '../data/seed'
import { IconArrowRight, IconCheck, IconPhone, IconWhatsApp } from '../components/Icons'

// Layout follows the client's category-page mockup (bike rental), applied to every category.

const HIGHLIGHT_ICONS = ['map-pin', 'users', 'chart']
const STEP_COLORS = ['text-brand-600', 'text-brand-600', 'text-blue-600', 'text-orange-500', 'text-magenta-500']

/** Brand-style icon + colour for a promotion channel name. */
function channelStyle(name) {
  const n = name.toLowerCase()
  if (n.includes('business profile')) return { icon: 'map-pin', cls: 'text-emerald-600 bg-emerald-50' }
  if (n.includes('google')) return { icon: 'google', cls: 'text-blue-600 bg-blue-50' }
  if (n.includes('meta') || n.includes('facebook')) return { icon: 'meta', cls: 'text-violet-600 bg-violet-50' }
  if (n.includes('seo')) return { icon: 'chart', cls: 'text-orange-600 bg-orange-50' }
  if (n.includes('whatsapp')) return { icon: 'whatsapp', cls: 'text-green-700 bg-green-50' }
  return { icon: 'megaphone', cls: 'text-brand-700 bg-brand-50' }
}

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)

export default function CategoryDetail() {
  const { slug } = useParams()
  const { getCategory, activePlans, activeServices, activeCategories, settings, addEnquiry } = useData()
  const category = getCategory(slug)

  const { canPay, startCheckout } = usePayment()
  const [selected, setSelected] = useState(() => new Set())
  const [billing, setBilling] = useState('monthly')
  const [form, setForm] = useState({ business: '', name: '', whatsapp: '', city: '', inventory: '', budget: '', goal: '', plan: '', consent: false })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(null)

  useEffect(() => {
    setSelected(new Set())
    setSent(null)
    setErrors({})
    setForm((f) => ({ ...f, inventory: '', plan: '' }))
  }, [slug])

  const subs = useMemo(() => (category?.subcategories || []).filter((s) => s.active !== false), [category])
  const plans = activePlans.filter((p) => p.showOnCategory !== false)

  if (!category || !category.active) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="h2">Category not available</h1>
        <p className="muted mx-auto mt-3 max-w-md">
          This rental category is not published right now. Browse the categories we are currently promoting.
        </p>
        <Link to="/categories" className="btn-primary mt-8">
          View all categories
          <IconArrowRight className="h-4 w-4" />
        </Link>
      </div>
    )
  }

  const number = resolveWhatsappNumber(category, settings)
  const annualPct = Number(settings.annualDiscount ?? 20)
  const monthlyPct = Number(settings.monthlyDiscount ?? 5)
  const typeLabel = category.typeLabel || 'rental types'
  const selectedNames = subs.filter((s) => selected.has(s.id)).map((s) => s.name)
  const chosenPlan = plans.find((p) => p.name === form.plan)
  const planLabel = form.plan ? `${form.plan}${billing === 'annual' && chosenPlan && !chosenPlan.free ? ' (Annual)' : ''}` : ''

  const headline = category.headline || 'More customers. More rental bookings.'
  const cut = headline.indexOf('. ')
  const lead = cut >= 0 ? headline.slice(0, cut + 1) : headline
  const rest = cut >= 0 ? headline.slice(cut + 2) : ''
  const related = activeCategories.filter((c) => c.group === category.group && c.id !== category.id).slice(0, 4)

  const messageFields = () => ({
    name: form.name.trim(),
    business: form.business.trim(),
    mobile: form.whatsapp.replace(/\D/g, ''),
    category: category.name,
    subcategories: selectedNames,
    plan: planLabel,
    location: form.city.trim(),
    inventory: form.inventory.trim() && `${form.inventory.trim()} (${category.inventoryLabel || 'inventory'})`,
    budget: form.budget,
    goal: form.goal,
  })
  // "Continue on WhatsApp" sends whatever has been filled in so far
  const liveHref = whatsappLink(number, buildEnquiryMessage(messageFields(), settings.name))
  const quickHref = whatsappLink(
    number,
    selectedNames.length
      ? `${buildQuickMessage(settings.name, category.name)}\nRental types: ${selectedNames.join(', ')}`
      : buildQuickMessage(settings.name, category.name),
  )

  const toggleSub = (id) =>
    setSelected((s) => {
      const next = new Set(s)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  const allSelected = subs.length > 0 && subs.every((s) => selected.has(s.id))
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const set = (k) => (e) => {
    const v = e?.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((x) => ({ ...x, [k]: undefined }))
  }

  // Paid plans open Razorpay checkout with the billing cycle chosen above.
  // The free plan - and any plan without an online price, or when payments are
  // switched off - keeps the original behaviour: preselect it in the form below.
  const choosePlan = (plan) => {
    setForm((f) => ({ ...f, plan: plan.name }))
    setSent(null)
    if (canPay(plan, billing) && startCheckout(plan, billing)) return
    scrollTo('get-started')
  }

  const submit = async (ev) => {
    ev.preventDefault()
    const e = {}
    if (!form.business.trim()) e.business = 'Enter your business name.'
    if (!form.name.trim()) e.name = 'Enter your name.'
    if (!/^\d{10}$/.test(form.whatsapp.replace(/\D/g, ''))) e.whatsapp = 'Enter a 10-digit WhatsApp number.'
    if (!form.city.trim()) e.city = 'Enter your city or service area.'
    if (!form.consent) e.consent = 'Please agree to be contacted.'
    setErrors(e)
    if (Object.keys(e).length) return

    const payload = {
      owner: form.name.trim(),
      business: form.business.trim(),
      mobile: form.whatsapp.replace(/\D/g, ''),
      whatsapp: form.whatsapp.replace(/\D/g, ''),
      categoryId: category.id,
      subcategories: selectedNames,
      city: form.city.trim(),
      state: '',
      inventory: form.inventory.trim(),
      plan: planLabel,
      budget: form.budget,
      goal: form.goal,
      service: '',
      message: '',
      routedTo: number,
      routedTeam: category.team || 'Default',
      source: `Category page · ${category.name}`,
    }
    const link = whatsappLink(number, buildEnquiryMessage(messageFields(), settings.name))
    setSent({ id: '', link })
    window.open(link, '_blank', 'noopener,noreferrer')

    try {
      const record = await addEnquiry(payload)
      setSent((s) => ({ ...s, id: record.id }))
    } catch (err) {
      setSent((s) => ({ ...s, error: err.message }))
    }
  }

  return (
    <div className="pb-6">
      {/* ------------------------------------------------ section nav */}
      <div className="sticky top-[72px] z-30 border-b border-black/5 bg-white/90 backdrop-blur">
        <div className="container-x flex items-center justify-between gap-3 py-1.5">
          <nav className="no-scrollbar -mx-2 flex items-center gap-1 overflow-x-auto text-sm font-medium" aria-label="Page sections">
            {[
              ['types', cap(typeLabel)],
              ['support', 'Marketing support'],
              ['plans', 'Plans'],
              ['get-started', 'Get started'],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => scrollTo(id)}
                className="shrink-0 rounded-full px-3 py-2 text-ink/70 hover:bg-brand-50 hover:text-brand-700"
              >
                {label}
              </button>
            ))}
          </nav>
          <a
            href={quickHref}
            target="_blank"
            rel="noreferrer"
            className="btn hidden shrink-0 border border-[#25D366] bg-white py-1.5 text-[#128C4A] hover:bg-emerald-50 md:inline-flex"
          >
            <IconWhatsApp className="h-4 w-4 text-[#25D366]" /> Chat on WhatsApp
          </a>
        </div>
      </div>

      {/* ------------------------------------------------ hero */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <span className="pointer-events-none absolute -right-20 -top-10 h-72 w-72 rounded-full bg-fuchsia-300/15 blur-3xl" />
        <div className="container-x pb-10 pt-5">
          <nav className="flex flex-wrap items-center gap-2 text-xs text-ink/50" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-brand-700">Home</Link>
            <span aria-hidden="true">/</span>
            <Link to="/categories" className="hover:text-brand-700">Rental marketing</Link>
            <span aria-hidden="true">/</span>
            <span className="font-semibold text-ink/80">{category.name}</span>
          </nav>

          <div className="mt-5 grid items-center gap-8 lg:grid-cols-[1.5fr_0.8fr_280px]">
            <div>
              <h1 className="text-[2.1rem] font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-[2.7rem]">
                {lead}
                {rest && (
                  <>
                    <br />
                    <span className="grad-text">{rest}</span>
                  </>
                )}
              </h1>
              <p className="muted mt-4 max-w-xl text-base leading-relaxed">{category.intro}</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button type="button" className="btn-primary px-7 py-3" onClick={() => scrollTo('plans')}>
                  Compare plans <IconArrowRight className="h-4 w-4" />
                </button>
                <a
                  href={quickHref}
                  target="_blank"
                  rel="noreferrer"
                  className="btn border-2 border-[#25D366] bg-white px-7 py-2.5 text-[#128C4A] hover:bg-emerald-50"
                >
                  <IconWhatsApp className="h-5 w-5 text-[#25D366]" /> Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* featured image: admin banner, else category image, else the category icon */}
            <div className="relative mx-auto hidden h-60 w-full max-w-[320px] place-items-center sm:grid">
              <span className="absolute inset-6 rounded-full bg-gradient-to-br from-brand-200/70 via-fuchsia-100/60 to-white blur-2xl" />
              {category.banner ? (
                <img src={category.banner} alt={category.name} className="relative max-h-full max-w-full object-contain drop-shadow-xl" />
              ) : category.image ? (
                <img src={category.image} alt="" className="relative h-44 w-44 object-contain drop-shadow-xl" />
              ) : (
                <CategoryArt slug={category.slug} icon={category.icon} color={category.color} image={category.image} size={176} className="relative" />
              )}
            </div>

            <ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {(category.highlights || []).map((h, i) => (
                <li key={h.title} className="flex items-center gap-3 rounded-2xl border border-white bg-white/80 p-4 shadow-card backdrop-blur">
                  <AppIcon name={HIGHLIGHT_ICONS[i] || 'star'} className="h-7 w-7 shrink-0 text-brand-600" />
                  <span>
                    <span className="block text-sm font-bold leading-snug">{h.title}</span>
                    <span className="muted block text-xs leading-snug">{h.text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ 01 types + 03 form */}
      <div className="container-x -mt-2 grid items-start gap-5 lg:grid-cols-2">
        <section id="types" className="card scroll-mt-32 p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <StepHeading n="01" title={`Choose your ${typeLabel}`} sub={`Select all the ${typeLabel} you offer.`} />
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-brand-700">
                {subs.length} {typeLabel} · {selected.size} selected
              </span>
              <button
                type="button"
                className="rounded-full border border-brand-200 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-50"
                onClick={() => setSelected(allSelected ? new Set() : new Set(subs.map((s) => s.id)))}
              >
                {allSelected ? 'Clear all' : 'Select all'}
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2">
            {subs.map((s) => {
              const on = selected.has(s.id)
              return (
                <label
                  key={s.id}
                  title={s.sample ? `e.g. ${s.sample}` : undefined}
                  className={`flex h-full cursor-pointer items-center gap-3 rounded-xl border bg-white p-3 transition hover:border-brand-300 ${
                    on ? 'border-brand-500 bg-brand-50/40 ring-2 ring-brand-100' : 'border-black/[.07]'
                  }`}
                >
                  <input type="checkbox" className="h-4 w-4 shrink-0 accent-brand-600" checked={on} onChange={() => toggleSub(s.id)} />
                  <IconTile icon={s.icon} color={s.color} image={s.image} size="sm" shape="circle" />
                  <span className="min-w-0 text-sm font-semibold leading-snug">{s.name}</span>
                </label>
              )
            })}
          </div>
        </section>

        <section id="get-started" className="card scroll-mt-32 p-4 sm:p-5">
          <StepHeading n="03" title="Tell us about your business" sub="Share a few details and we'll help you choose a plan." />

          {sent ? (
            <div className="py-10 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
                <IconCheck className="h-7 w-7" />
              </span>
              <h3 className="mt-4 text-xl font-bold">Enquiry ready on WhatsApp</h3>
              <p className="muted mx-auto mt-2 max-w-md text-sm">
                Reference <strong className="text-ink">{sent.id}</strong>. Your details were added to a WhatsApp message for our{' '}
                {category.name.toLowerCase()} team ({prettyPhone(number)}). Review it and tap Send.
              </p>
                {sent.error && (
                  <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                    Your message is ready in WhatsApp, but we could not save a copy to the admin panel: {sent.error}
                  </p>
                )}
              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                <a href={sent.link} target="_blank" rel="noreferrer" className="btn-whatsapp">
                  <IconWhatsApp /> Open WhatsApp again
                </a>
                <button type="button" className="btn-outline" onClick={() => setSent(null)}>
                  Edit details
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="mt-4 grid gap-x-4 gap-y-3 sm:grid-cols-2">
              <Field label="Business name" error={errors.business}>
                <input className="field" placeholder="Enter your business name" value={form.business} onChange={set('business')} />
              </Field>
              <Field label={category.inventoryLabel || 'Inventory size'}>
                <input className="field" placeholder={category.inventoryPlaceholder || ''} value={form.inventory} onChange={set('inventory')} />
              </Field>
              <Field label="Contact name" error={errors.name}>
                <input className="field" placeholder="Enter your name" value={form.name} onChange={set('name')} />
              </Field>
              <Field label="Monthly marketing budget">
                <select className="field" value={form.budget} onChange={set('budget')}>
                  <option value="">Select budget range</option>
                  {BUDGET_OPTIONS.map((b) => <option key={b}>{b}</option>)}
                </select>
              </Field>
              <Field label="WhatsApp number" error={errors.whatsapp}>
                <input
                  className="field"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="Enter your WhatsApp number"
                  value={form.whatsapp}
                  onChange={(e) => set('whatsapp')(e.target.value.replace(/\D/g, '').slice(0, 10))}
                />
              </Field>
              <Field label="Primary goal">
                <select className="field" value={form.goal} onChange={set('goal')}>
                  <option value="">Choose a goal</option>
                  {GOAL_OPTIONS.map((g) => <option key={g}>{g}</option>)}
                </select>
              </Field>
              <Field label="City / service area" error={errors.city}>
                <input className="field" placeholder="Enter your city or service area" value={form.city} onChange={set('city')} />
              </Field>
              <Field label="Preferred plan">
                <select className="field" value={form.plan} onChange={set('plan')}>
                  <option value="">Choose a plan</option>
                  {plans.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              </Field>

              <div className="flex flex-wrap gap-2 sm:col-span-2">
                <button
                  type="button"
                  onClick={() => scrollTo('types')}
                  className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs text-ink/70"
                >
                  <AppIcon name={category.icon} className="h-4 w-4 shrink-0 text-blue-600" />
                  <span className="shrink-0 font-semibold">{cap(typeLabel)}:</span>
                  <span className={`truncate ${selectedNames.length ? 'text-ink/80' : 'text-magenta-500'}`}>
                    {selectedNames.length ? selectedNames.join(', ') : 'None selected'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => scrollTo('plans')}
                  className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs text-ink/70"
                >
                  <AppIcon name="crown" className="h-4 w-4 text-amber-500" />
                  <span className="font-semibold">Plan:</span>
                  <span className={planLabel ? 'text-ink/80' : 'text-magenta-500'}>{planLabel || 'Not selected'}</span>
                </button>
              </div>

              <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex items-start gap-2.5 text-sm text-ink/70">
                  <input type="checkbox" className="mt-0.5 h-4 w-4 accent-brand-600" checked={form.consent} onChange={set('consent')} />
                  <span>
                    I agree to be contacted about my enquiry.
                    {errors.consent && <span className="block text-xs font-medium text-red-600">{errors.consent}</span>}
                  </span>
                </label>
                <button type="submit" className="btn-primary shrink-0 whitespace-nowrap px-6 py-2.5">
                  Request my marketing plan <IconArrowRight className="h-4 w-4" />
                </button>
              </div>
              <a
                href={liveHref}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-center text-sm font-semibold text-emerald-700 hover:bg-emerald-100 sm:col-span-2"
              >
                <IconWhatsApp className="h-4 w-4 shrink-0 text-[#25D366]" /> Continue on WhatsApp with your selected details
              </a>
            </form>
          )}
        </section>
      </div>

      {/* ------------------------------------------------ marketing support */}
      <section id="support" className="container-x scroll-mt-32 pt-12">
        <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">How we help you win more bookings</h2>
        <p className="muted mt-1">{category.supportSub}</p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(category.features || []).map((f) => (
            <div key={f.title} className="card flex h-full items-start gap-3 p-4">
              <IconTile icon={f.icon} color={f.color} size="sm" />
              <div>
                <h3 className="font-bold">{f.title}</h3>
                <p className="muted mt-0.5 text-sm leading-snug">{f.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="card mt-3 flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="font-bold">Your promotion channels</h3>
            <p className="muted text-xs">Channels depend on your selected scope.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(category.channels || []).map((c) => {
              const st = channelStyle(c)
              return (
                <span key={c} className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold ${st.cls}`}>
                  <AppIcon name={st.icon} className="h-4 w-4" /> {c}
                </span>
              )
            })}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ 02 plans */}
      <section id="plans" className="container-x scroll-mt-32 pt-12">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <StepHeading n="02" title="Choose your marketing plan" sub="Start with a focused plan. Expand as your business grows." />
          <div className="flex flex-wrap items-center gap-3">
            <Link to="/plans" className="text-sm font-semibold text-brand-700 hover:underline">
              Proposed packages
            </Link>
            <div className="inline-flex rounded-full border border-brand-200 bg-white p-1" role="group" aria-label="Billing">
              {[
                ['monthly', 'Monthly'],
                ['annual', `Annual - Save ${annualPct}%`],
              ].map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={billing === id}
                  onClick={() => setBilling(id)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                    billing === id ? 'bg-brand-600 text-white' : 'text-brand-700 hover:bg-brand-50'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className={`mt-7 grid items-stretch gap-4 sm:grid-cols-2 ${plans.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
          {plans.map((p) => (
            <PlanCard key={p.id} plan={p} billing={billing} monthlyPct={monthlyPct} annualPct={annualPct} onChoose={choosePlan} />
          ))}
        </div>
        <p className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-brand-50/70 px-4 py-2.5 text-center text-xs text-ink/60">
          <AppIcon name="bolt" className="h-4 w-4 shrink-0 text-brand-600" />
          Service scope confirmed before launch. Ad spend and applicable taxes are separate.
        </p>
      </section>

      {/* ------------------------------------------------ getting started */}
      <section className="container-x pt-12">
        <div className="card p-4 sm:p-5">
          <h2 className="text-2xl font-extrabold tracking-tight">Getting started</h2>
          <ol className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:divide-x lg:divide-black/5">
            {NEXT_STEPS.map((s, i) => (
              <li key={s.title} className="flex items-start gap-3 lg:px-3 lg:first:pl-0">
                <span className={`step-num h-11 w-11 bg-white text-base shadow-card ${STEP_COLORS[i]}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span>
                  <span className="block text-sm font-bold">{s.title}</span>
                  <span className="muted block text-xs leading-snug">
                    {category.group === 'vehicle' ? s.text : s.text.replace('your fleet', 'your business')}
                  </span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className="card mt-4 p-4 sm:p-5">
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="flex items-start gap-4">
              <IconTile icon="building" color="blue" size="md" />
              <div>
                <h3 className="text-lg font-bold">Built for {category.name.toLowerCase()} businesses</h3>
                <p className="muted mt-1 text-sm">{category.builtFor}</p>
                <ul className="mt-3 space-y-1.5">
                  {(category.benefits || []).map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-ink/75">
                      <IconCheck className="check" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex items-start gap-4 lg:border-l lg:border-black/5 lg:pl-5">
              <IconTile icon="users" color="violet" size="md" />
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold">Your role &amp; results</h3>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-bold text-brand-700">Your role</p>
                    <ul className="mt-1.5 space-y-1.5">
                      {(category.role || []).map((r) => (
                        <li key={r} className="flex items-start gap-2 text-sm text-ink/75">
                          <IconCheck className="check" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-brand-700">Measure</p>
                    <ul className="mt-1.5 space-y-1.5">
                      {(category.outcomes || []).map((o) => (
                        <li key={o} className="flex items-start gap-2 text-sm text-ink/75">
                          <IconCheck className="check" />
                          {o}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-amber-50/80 px-4 py-2 text-center text-xs text-ink/65">
            <AppIcon name="bolt" className="h-4 w-4 shrink-0 text-amber-500" />
            Bookings depend on demand, budget, availability, pricing and follow-up.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------ more ways to grow + related */}
      <section className="container-x pt-10">
        <h2 className="text-lg font-extrabold tracking-tight">More ways to grow</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {activeServices.slice(0, 4).map((s) => (
            <Link key={s.id} to={`/services/${s.slug}`} className="card card-hover flex items-center gap-3 p-3.5">
              <IconTile icon={s.icon} color={s.color} image={s.image} size="xs" />
              <span className="min-w-0 flex-1 text-sm font-semibold leading-snug">{s.name}</span>
              <IconArrowRight className="h-4 w-4 shrink-0 text-brand-600" />
            </Link>
          ))}
        </div>

        {related.length > 0 && (
          <>
            <h2 className="mt-7 text-lg font-extrabold tracking-tight">Related rental categories</h2>
            <div className="mt-3 flex flex-wrap gap-3">
              {related.map((c) => (
                <Link key={c.id} to={`/categories/${c.slug}`} className="card card-hover flex items-center gap-2.5 px-4 py-2.5">
                  <AppIcon name={c.icon} className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-semibold">{c.name}</span>
                </Link>
              ))}
            </div>
          </>
        )}

        <div className="mt-8 flex flex-col gap-4 rounded-2xl bg-gradient-to-r from-brand-100/80 via-brand-50 to-fuchsia-50 p-4 sm:p-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <IconTile icon="message" color="violet" size="sm" shape="circle" className="bg-white" />
            <div>
              <h3 className="text-lg font-bold text-brand-700">Need help choosing?</h3>
              <p className="muted text-sm">Talk to our {category.name.toLowerCase()} marketing team.</p>
            </div>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <a href={quickHref} target="_blank" rel="noreferrer" className="btn-whatsapp px-7 py-2.5">
              <IconWhatsApp /> Chat on WhatsApp
            </a>
            <span className="hidden h-8 w-px bg-black/10 sm:block" />
            <a
              href={`tel:${String(settings.phone).replace(/\s/g, '')}`}
              className="flex items-center justify-center gap-2 text-sm font-bold text-ink hover:text-brand-700"
            >
              <IconPhone className="h-4 w-4 text-brand-600" /> {settings.phone}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

function StepHeading({ n, title, sub }) {
  return (
    <div className="flex items-center gap-3">
      <span className="step-num h-11 w-11 text-sm">{n}</span>
      <div>
        <h2 className="text-xl font-extrabold leading-tight tracking-tight sm:text-2xl">{title}</h2>
        {sub && <p className="muted text-sm">{sub}</p>}
      </div>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs font-medium text-red-600">{error}</span>}
    </label>
  )
}
