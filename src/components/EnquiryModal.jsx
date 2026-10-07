import { useEffect, useMemo, useState } from 'react'
import Modal from './Modal'
import { useData } from '../context/DataContext'
import { INDIAN_STATES, BUDGET_OPTIONS } from '../data/seed'
import {
  buildEnquiryMessage,
  resolveWhatsappNumber,
  routeSource,
  whatsappLink,
} from '../utils/whatsapp'
import AppIcon from './AppIcon'
import { prettyPhone } from '../utils/format'
import {
  IconBolt,
  IconCheck,
  IconDoc,
  IconShield,
  IconWhatsApp,
} from './Icons'

const EMPTY = {
  owner: '',
  business: '',
  mobile: '',
  whatsapp: '',
  email: '',
  categoryId: '',
  subcategories: [],
  city: '',
  district: '',
  state: '',
  hasWebsite: 'No',
  website: '',
  plan: '',
  service: '',
  budget: '',
  contactTime: '',
  notes: '',
}

export default function EnquiryModal({ open, onClose, category = null, plan = '', service = '' }) {
  const { settings, groupedCategories, activePlans, activeServices, addEnquiry, getCategory, getService } = useData()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [done, setDone] = useState(null)

  useEffect(() => {
    if (!open) return
    setDone(null)
    setErrors({})
    setForm((f) => ({
      ...EMPTY,
      ...f,
      categoryId: category?.id || f.categoryId || '',
      subcategories: category && category.id !== f.categoryId ? [] : f.subcategories || [],
      plan: plan || f.plan || '',
      service: service || f.service || '',
    }))
  }, [open, category, plan, service])

  const selectedCategory = useMemo(
    () => getCategory(form.categoryId) || category || null,
    [form.categoryId, category, getCategory],
  )
  const selectedService = useMemo(() => (form.service ? getService(form.service) : null), [form.service, getService])
  const routedNumber = resolveWhatsappNumber(selectedCategory, settings, selectedService)
  const source = routeSource(selectedCategory, selectedService)
  const routedTeam =
    source === 'category'
      ? `our ${selectedCategory.name} team`
      : source === 'service'
        ? `our ${selectedService.name} team`
        : 'our team'
  const subOptions = (selectedCategory?.subcategories || []).filter((s) => s.active !== false)
  const toggleSub = (name) =>
    setForm((f) => ({
      ...f,
      subcategories: f.subcategories.includes(name) ? f.subcategories.filter((x) => x !== name) : [...f.subcategories, name],
    }))

  const set = (k) => (e) => {
    const v = e && e.target ? e.target.value : e
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((x) => ({ ...x, [k]: undefined }))
  }

  const validate = () => {
    const e = {}
    if (!form.owner.trim()) e.owner = 'Please enter the business owner name.'
    if (!form.business.trim()) e.business = 'Please enter your business name.'
    if (!/^\d{10}$/.test(form.mobile.replace(/\D/g, ''))) e.mobile = 'Enter a valid 10-digit mobile number.'
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email address.'
    if (!form.categoryId) e.categoryId = 'Select your rental category.'
    if (!form.city.trim()) e.city = 'Please enter your city.'
    if (!form.state) e.state = 'Please select your state.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const submit = async (ev) => {
    ev.preventDefault()
    if (!validate()) return

    const location = [form.city, form.district, form.state].filter(Boolean).join(', ')

    const payload = {
      owner: form.owner.trim(),
      business: form.business.trim(),
      mobile: form.mobile.replace(/\D/g, ''),
      whatsapp: form.whatsapp.replace(/\D/g, ''),
      email: form.email.trim(),
      categoryId: form.categoryId,
      subcategories: form.subcategories,
      city: form.city.trim(),
      district: form.district.trim(),
      state: form.state,
      hasWebsite: form.hasWebsite,
      website: form.website.trim(),
      plan: form.plan,
      service: form.service,
      budget: form.budget,
      contactTime: form.contactTime,
      message: form.notes.trim(),
      routedTo: routedNumber,
      routedTeam: selectedCategory?.team || 'Default',
      source: 'Website enquiry form',
    }

    const message = buildEnquiryMessage(
      {
        name: form.owner.trim(),
        mobile: form.mobile.replace(/\D/g, ''),
        business: form.business.trim(),
        category: selectedCategory?.name,
        subcategories: form.subcategories,
        plan: form.plan,
        service: form.service,
        location,
        budget: form.budget,
        contactTime: form.contactTime,
        notes: form.notes.trim(),
      },
      settings.name,
    )

    const link = whatsappLink(routedNumber, message)
    setDone({ id: '', link })
    window.open(link, '_blank', 'noopener,noreferrer')

    try {
      const record = await addEnquiry(payload)
      setDone((s) => ({ ...s, id: record.id }))
    } catch (err) {
      setDone((s) => ({ ...s, error: err.message }))
    }
  }

  return (
    <Modal open={open} onClose={onClose} size="lg" labelledBy="enquiry-title">
      {done ? (
        <div className="p-8 text-center sm:p-12">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
            <IconCheck className="h-8 w-8" />
          </div>
          <h2 className="h2 mt-6">Enquiry submitted</h2>
          <p className="muted mx-auto mt-3 max-w-md text-sm">
            Reference <span className="font-semibold text-ink">{done.id}</span>. Your details are in a WhatsApp message for{' '}
            <span className="font-semibold text-ink">{routedTeam}</span> ({prettyPhone(routedNumber)}). Review it and tap Send.
          </p>
                {done.error && (
                  <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                    Your message is ready in WhatsApp, but we could not save a copy to the admin panel: {done.error}
                  </p>
                )}
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={done.link} target="_blank" rel="noreferrer" className="btn-whatsapp">
              <IconWhatsApp /> Open WhatsApp again
            </a>
            <button type="button" className="btn-outline" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} noValidate>
          <div className="border-b border-black/5 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-100 text-brand-600">
                <IconDoc className="h-6 w-6" />
              </span>
              <div>
                <h2 id="enquiry-title" className="text-2xl font-extrabold tracking-tight sm:text-[28px]">
                  Submit Your Business Requirements
                </h2>
                <p className="muted mt-1 text-sm">We&apos;ll route this straight to the right team on WhatsApp.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 rounded-2xl bg-brand-50/70 p-4 sm:grid-cols-3">
              <Assurance icon={<IconWhatsApp className="h-5 w-5" />} title="WhatsApp Routing">
                Enquiries go directly to the right team instantly
              </Assurance>
              <Assurance icon={<IconBolt />} title="Quick Response">
                Get a response within minutes, not hours
              </Assurance>
              <Assurance icon={<IconShield />} title="100% Secure">
                Your information is safe with us
              </Assurance>
            </div>
          </div>

          <div className="grid gap-5 p-6 sm:grid-cols-2 sm:p-8">
            <Field label="Business Owner Name" required error={errors.owner}>
              <input className="field" placeholder="Full name" value={form.owner} onChange={set('owner')} />
            </Field>
            <Field label="Business Name" required error={errors.business}>
              <input className="field" placeholder="Your business" value={form.business} onChange={set('business')} />
            </Field>

            <Field label="Mobile Number" required error={errors.mobile}>
              <div className="flex gap-2">
                <span className="grid shrink-0 place-items-center rounded-xl border border-black/10 bg-black/[.03] px-3 text-sm font-semibold text-ink/70">
                  +91
                </span>
                <input
                  className="field"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  value={form.mobile}
                  onChange={(e) => set('mobile')(e.target.value.replace(/\D/g, '').slice(0, 10))}
                />
              </div>
            </Field>
            <Field label="WhatsApp Number">
              <input
                className="field"
                inputMode="numeric"
                maxLength={10}
                placeholder="If different from mobile number"
                value={form.whatsapp}
                onChange={(e) => set('whatsapp')(e.target.value.replace(/\D/g, '').slice(0, 10))}
              />
            </Field>

            <Field label="Email Address" error={errors.email}>
              <input className="field" type="email" placeholder="you@business.com" value={form.email} onChange={set('email')} />
            </Field>
            <Field label="Rental Category" required error={errors.categoryId}>
              <select
                className="field"
                value={form.categoryId}
                onChange={(e) => {
                  set('categoryId')(e)
                  setForm((f) => ({ ...f, subcategories: [] }))
                }}
              >
                <option value="">Select category</option>
                {groupedCategories.map((g) => (
                  <optgroup key={g.id} label={g.name}>
                    {g.items.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </Field>

            {subOptions.length > 0 && (
              <div className="sm:col-span-2">
                <span className="label">
                  {selectedCategory.typeLabel ? selectedCategory.typeLabel[0].toUpperCase() + selectedCategory.typeLabel.slice(1) : 'Rental types'} you offer
                  <span className="font-normal text-ink/40">(optional)</span>
                </span>
                <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto rounded-2xl bg-black/[.02] p-3">
                  {subOptions.map((s) => {
                    const on = form.subcategories.includes(s.name)
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => toggleSub(s.name)}
                        aria-pressed={on}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ring-1 transition ${
                          on ? 'bg-brand-600 text-white ring-brand-600' : 'bg-white text-ink/70 ring-black/10 hover:ring-brand-300'
                        }`}
                      >
                        <AppIcon name={s.icon} className="h-3.5 w-3.5" />
                        {s.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            <Field label="City" required error={errors.city}>
              <input className="field" placeholder="Enter your city" value={form.city} onChange={set('city')} />
            </Field>
            <Field label="District">
              <input className="field" placeholder="Enter your district" value={form.district} onChange={set('district')} />
            </Field>

            <Field label="State" required error={errors.state}>
              <select className="field" value={form.state} onChange={set('state')}>
                <option value="">Select your state</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>

            <div className="sm:col-span-2">
              <div className="rounded-2xl bg-black/[.02] p-4">
                <span className="label">
                  <AppIcon name="browser" className="h-4 w-4 text-brand-600" /> Existing Website?
                </span>
                <div className="flex flex-wrap items-center gap-5">
                  {['Yes', 'No'].map((v) => (
                    <label key={v} className="flex cursor-pointer items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="hasWebsite"
                        className="h-4 w-4 accent-brand-600"
                        checked={form.hasWebsite === v}
                        onChange={() => set('hasWebsite')(v)}
                      />
                      {v}
                    </label>
                  ))}
                  {form.hasWebsite === 'Yes' && (
                    <input
                      className="field sm:max-w-xs"
                      placeholder="https://your-website.com"
                      value={form.website}
                      onChange={set('website')}
                    />
                  )}
                </div>
              </div>
            </div>

            <Field label="Selected Plan">
              <select className="field" value={form.plan} onChange={set('plan')}>
                <option value="">Select plan</option>
                {activePlans.map((p) => (
                  <option key={p.id}>{p.name}</option>
                ))}
              </select>
            </Field>
            <Field label="Required Service">
              <select className="field" value={form.service} onChange={set('service')}>
                <option value="">Select service</option>
                {activeServices.map((s) => (
                  <option key={s.id}>{s.name}</option>
                ))}
              </select>
            </Field>

            <Field label="Advertising Budget">
              <select className="field" value={form.budget} onChange={set('budget')}>
                <option value="">Select budget</option>
                {BUDGET_OPTIONS.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
            </Field>
            <Field label="Preferred Contact Time">
              <input
                className="field"
                placeholder="e.g. Weekdays, 11 AM–1 PM"
                value={form.contactTime}
                onChange={set('contactTime')}
              />
            </Field>

            <div className="sm:col-span-2">
              <Field label="Additional Requirements">
                <textarea
                  className="field min-h-[96px] resize-y"
                  maxLength={500}
                  placeholder="Anything else we should know?"
                  value={form.notes}
                  onChange={set('notes')}
                />
                <div className="mt-1 text-right text-[11px] text-ink/40">{form.notes.length} / 500</div>
              </Field>
            </div>
          </div>

          <div className="space-y-4 border-t border-black/5 p-6 sm:p-8">
            <p className="flex items-center justify-center gap-2 rounded-xl bg-brand-50 py-3 text-xs text-brand-800">
              <IconShield className="h-4 w-4" />
              Your enquiry will open in WhatsApp for {routedTeam} · {prettyPhone(routedNumber)}
            </p>
            <button type="submit" className="btn-primary w-full py-3.5 text-base">
              Submit Enquiry
            </button>
            <p className="text-center text-xs text-ink/45">We respect your privacy. No spam, ever.</p>
          </div>
        </form>
      )}
    </Modal>
  )
}

function Assurance({ icon, title, children }) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-brand-600 shadow-sm">{icon}</span>
      <div>
        <p className="text-sm font-bold text-brand-700">{title}</p>
        <p className="text-xs text-ink/60">{children}</p>
      </div>
    </div>
  )
}

function Field({ label, required, error, children }) {
  return (
    <label className="block">
      <span className="label">
        {label}
        {required && <span className="text-magenta-500">*</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs font-medium text-red-600">{error}</span>}
    </label>
  )
}
