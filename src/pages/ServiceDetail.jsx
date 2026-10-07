import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AppIcon, { IconTile, colorOf } from '../components/AppIcon'
import { CtaStrip } from '../components/Sections'
import { useData } from '../context/DataContext'
import { buildEnquiryMessage, buildQuickMessage, resolveWhatsappNumber, routeSource, whatsappLink } from '../utils/whatsapp'
import { prettyPhone } from '../utils/format'
import { IconArrowRight, IconCheck, IconWhatsApp } from '../components/Icons'

const STEPS = [
  { icon: 'file', title: 'Share your details', text: 'Tell us your rental category, service area and goals.' },
  { icon: 'clipboard', title: 'Agree the scope', text: 'Confirm deliverables, service fee and any ad budget.' },
  { icon: 'rocket', title: 'Approve and launch', text: 'Provide access and approve the work before it goes live.' },
  { icon: 'chart', title: 'Review and improve', text: 'Review enquiries and results, then refine together.' },
]

export default function ServiceDetail() {
  const { slug } = useParams()
  const { getService, getCategory, activeServices, groupedCategories, activeCategories, settings, addEnquiry } = useData()
  const service = getService(slug)

  const [form, setForm] = useState({ categoryId: '', name: '', business: '', whatsapp: '', city: '', notes: '', consent: false })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(null)

  useEffect(() => {
    setSent(null)
    setErrors({})
  }, [slug])

  if (!service || !service.active) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="h2">Service not available</h1>
        <p className="muted mx-auto mt-3 max-w-md">This service is not published right now. Browse the services we currently offer.</p>
        <Link to="/services" className="btn-primary mt-8">
          View all services <IconArrowRight className="h-4 w-4" />
        </Link>
      </div>
    )
  }

  const category = form.categoryId ? getCategory(form.categoryId) : null
  const number = resolveWhatsappNumber(category, settings, service)
  const source = routeSource(category, service)
  const quickHref = whatsappLink(number, buildQuickMessage(settings.name, category?.name, service.name))
  const c = colorOf(service.color)
  const related = activeServices.filter((s) => s.id !== service.id).slice(0, 3)

  const set = (k) => (e) => {
    const v = e?.target ? (e.target.type === 'checkbox' ? e.target.checked : e.target.value) : e
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((x) => ({ ...x, [k]: undefined }))
  }

  const submit = async (ev) => {
    ev.preventDefault()
    const e = {}
    if (!form.name.trim()) e.name = 'Enter your name.'
    if (!form.business.trim()) e.business = 'Enter your business name.'
    if (!/^\d{10}$/.test(form.whatsapp.replace(/\D/g, ''))) e.whatsapp = 'Enter a 10-digit WhatsApp number.'
    if (!form.categoryId) e.categoryId = 'Select your rental category.'
    if (!form.consent) e.consent = 'Please agree to be contacted.'
    setErrors(e)
    if (Object.keys(e).length) return

    const payload = {
      owner: form.name.trim(),
      business: form.business.trim(),
      mobile: form.whatsapp.replace(/\D/g, ''),
      whatsapp: form.whatsapp.replace(/\D/g, ''),
      categoryId: form.categoryId,
      city: form.city.trim(),
      state: '',
      plan: '',
      service: service.name,
      message: form.notes.trim(),
      routedTo: number,
      routedTeam: category?.team || 'Default',
      source: `Service page · ${service.name}`,
    }
    const link = whatsappLink(
      number,
      buildEnquiryMessage(
        {
          name: form.name.trim(),
          business: form.business.trim(),
          mobile: form.whatsapp.replace(/\D/g, ''),
          category: category?.name,
          service: service.name,
          location: form.city.trim(),
          notes: form.notes.trim(),
        },
        settings.name,
      ),
    )
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
      {/* hero */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <div className="container-x pb-10 pt-5">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-ink/50" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-brand-700">Home</Link>
            <span aria-hidden="true">›</span>
            <Link to="/services" className="hover:text-brand-700">Services</Link>
            <span aria-hidden="true">›</span>
            <span className="font-medium text-brand-700">{service.name}</span>
          </nav>
          <div className="mt-6 grid items-center gap-8 lg:grid-cols-[1fr_320px]">
            <div>
              {service.tag && <span className={`pill uppercase tracking-wider ${c.tile} ${c.text}`}>{service.tag}</span>}
              <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-[2.6rem]">{service.name}</h1>
              <p className="muted mt-3 max-w-2xl text-base leading-relaxed sm:text-lg">{service.description}</p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a href="#enquire" className="btn-primary px-6 py-3">
                  Enquire Now <IconArrowRight className="h-4 w-4" />
                </a>
                <a href={quickHref} target="_blank" rel="noreferrer" className="btn-whatsapp px-6 py-3">
                  <IconWhatsApp /> Chat on WhatsApp
                </a>
              </div>
            </div>
            <div className="relative mx-auto grid h-52 w-full max-w-[320px] place-items-center">
              <span className="absolute inset-6 rounded-full bg-gradient-to-br from-brand-200/60 via-fuchsia-100/50 to-white blur-xl" />
              {service.image ? (
                <img src={service.image} alt={service.name} className="relative max-h-full max-w-full rounded-3xl object-contain" />
              ) : (
                <span className={`relative grid h-40 w-40 place-items-center rounded-[2rem] bg-white shadow-card ${c.text}`}>
                  <AppIcon name={service.icon} className="h-20 w-20" strokeWidth={1.3} />
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="container-x pt-10">
        <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
          <div className="card p-6">
            <h2 className="text-xl font-bold">About this service</h2>
            <p className="muted mt-3 leading-relaxed">{service.overview || service.description}</p>
          </div>
          <div className="card p-6">
            <h2 className="text-xl font-bold">Benefits</h2>
            <ul className="mt-4 space-y-2.5">
              {(service.benefits || []).map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-sm text-ink/75">
                  <IconCheck className="check" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <h2 className="mt-12 text-2xl font-extrabold tracking-tight">Key features</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(service.points || []).map((p) => (
            <div key={p} className="card flex h-full items-start gap-3 p-5">
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${c.tile} ${c.text}`}>
                <IconCheck className="h-5 w-5" />
              </span>
              <p className="text-sm font-semibold leading-snug">{p}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-12 text-2xl font-extrabold tracking-tight">How it works</h2>
        <ol className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="card flex h-full flex-col p-5">
              <div className="flex items-center justify-between">
                <span className="step-num">{String(i + 1).padStart(2, '0')}</span>
                <AppIcon name={s.icon} className="h-6 w-6 text-brand-600" />
              </div>
              <p className="mt-4 font-bold">{s.title}</p>
              <p className="muted mt-1 text-sm">{s.text}</p>
            </li>
          ))}
        </ol>

        <div className="card mt-12 p-6">
          <h2 className="text-xl font-bold">Available for these rental categories</h2>
          <p className="muted mt-1 text-sm">
            {service.name} is planned around your category — {activeCategories.length} categories across vehicles, equipment, products and property.
          </p>
          <div className="mt-5 space-y-4">
            {groupedCategories.map((g) => (
              <div key={g.id}>
                <p className="kicker">{g.name}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {g.items.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        set('categoryId')(cat.id)
                        document.getElementById('enquire')?.scrollIntoView({ behavior: 'smooth' })
                      }}
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium ring-1 transition ${
                        form.categoryId === cat.id ? 'bg-brand-600 text-white ring-brand-600' : 'bg-white text-ink/75 ring-black/10 hover:ring-brand-300'
                      }`}
                    >
                      <AppIcon name={cat.icon} className="h-4 w-4" />
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* enquiry */}
      <section id="enquire" className="container-x scroll-mt-24 pt-12">
        <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
          <div className="card p-5 sm:p-6">
            <h2 className="text-xl font-bold">Enquire about {service.name}</h2>
            <p className="muted mt-1 text-sm">Your details open in WhatsApp so you can review them and tap Send.</p>
            {sent ? (
              <div className="py-8 text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <IconCheck className="h-7 w-7" />
                </span>
                <p className="mt-4 font-bold">Enquiry {sent.id} is ready in WhatsApp.</p>
                {sent.error && (
                  <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                    Your message is ready in WhatsApp, but we could not save a copy to the admin panel: {sent.error}
                  </p>
                )}
                <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
                  <a href={sent.link} target="_blank" rel="noreferrer" className="btn-whatsapp">
                    <IconWhatsApp /> Open WhatsApp again
                  </a>
                  <button type="button" className="btn-outline" onClick={() => setSent(null)}>
                    Edit details
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="Rental category" error={errors.categoryId}>
                  <select className="field" value={form.categoryId} onChange={set('categoryId')}>
                    <option value="">Select your category</option>
                    {groupedCategories.map((g) => (
                      <optgroup key={g.id} label={g.name}>
                        {g.items.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </Field>
                <Field label="Business name" error={errors.business}>
                  <input className="field" placeholder="Enter your business name" value={form.business} onChange={set('business')} />
                </Field>
                <Field label="Contact name" error={errors.name}>
                  <input className="field" placeholder="Enter your name" value={form.name} onChange={set('name')} />
                </Field>
                <Field label="WhatsApp number" error={errors.whatsapp}>
                  <input
                    className="field"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="10-digit number"
                    value={form.whatsapp}
                    onChange={(e) => set('whatsapp')(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  />
                </Field>
                <Field label="City / Service area">
                  <input className="field" placeholder="Enter your city or service area" value={form.city} onChange={set('city')} />
                </Field>
                <Field label="Requirements">
                  <input className="field" placeholder="e.g. Weekend promotion" value={form.notes} onChange={set('notes')} />
                </Field>
                <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                  <label className="flex items-start gap-2.5 text-sm text-ink/70">
                    <input type="checkbox" className="mt-0.5 h-4 w-4 accent-brand-600" checked={form.consent} onChange={set('consent')} />
                    <span>
                      I agree to be contacted about my enquiry.
                      {errors.consent && <span className="block text-xs font-medium text-red-600">{errors.consent}</span>}
                    </span>
                  </label>
                  <button type="submit" className="btn-primary px-6 py-3">
                    Send Enquiry on WhatsApp <IconArrowRight className="h-4 w-4" />
                  </button>
                </div>
                <p className="flex items-center gap-2 rounded-xl bg-emerald-50/70 px-3 py-2 text-xs text-emerald-800 sm:col-span-2">
                  <IconWhatsApp className="h-4 w-4 shrink-0 text-[#25D366]" />
                  Routes to {source === 'category' ? `the ${category.name} team` : source === 'service' ? 'our service team' : 'our main business number'} ·{' '}
                  {prettyPhone(number)}
                </p>
              </form>
            )}
          </div>

          <div className="card space-y-3 p-5 text-sm">
            <h2 className="text-lg font-bold">Contact information</h2>
            <a href={quickHref} target="_blank" rel="noreferrer" className="flex items-center gap-3 hover:text-brand-700">
              <IconTile icon="whatsapp" color="green" size="xs" />
              <span><span className="block font-semibold">WhatsApp</span><span className="muted">{prettyPhone(number)}</span></span>
            </a>
            <a href={`tel:${String(settings.phone).replace(/\s/g, '')}`} className="flex items-center gap-3 hover:text-brand-700">
              <IconTile icon="phone" color="violet" size="xs" />
              <span><span className="block font-semibold">Call</span><span className="muted">{settings.phone}</span></span>
            </a>
            <a href={`mailto:${settings.email}`} className="flex items-center gap-3 hover:text-brand-700">
              <IconTile icon="mail" color="pink" size="xs" />
              <span className="min-w-0"><span className="block font-semibold">Email</span><span className="muted break-all">{settings.email}</span></span>
            </a>
            <p className="flex items-center gap-3">
              <IconTile icon="clock" color="amber" size="xs" />
              <span><span className="block font-semibold">Business hours</span><span className="muted">{settings.hours}</span></span>
            </p>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-x pt-12">
          <h2 className="text-2xl font-extrabold tracking-tight">Related services</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {related.map((s) => (
              <Link key={s.id} to={`/services/${s.slug}`} className="card card-hover flex h-full flex-col p-5">
                <div className="flex items-center gap-3">
                  <IconTile icon={s.icon} color={s.color} image={s.image} size="sm" />
                  <p className="font-bold leading-snug">{s.name}</p>
                </div>
                <p className="muted mt-3 flex-1 text-sm">{s.description}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                  View Details <IconArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
          <CtaStrip className="mt-8" title="Not sure which services you need?" text="Tell us your rental category, location and goals." service={service} />
        </section>
      )}
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
