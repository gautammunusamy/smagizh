import { useState } from 'react'
import { useData } from '../context/DataContext'
import { buildEnquiryMessage, resolveWhatsappNumber, whatsappLink } from '../utils/whatsapp'
import { prettyPhone } from '../utils/format'
import { IconArrowRight, IconCheck, IconWhatsApp } from './Icons'

/**
 * "Request a marketing consultation" form. The chosen rental category decides
 * which WhatsApp number the enquiry opens with (category-wise routing).
 */
export default function ConsultationForm({ title = 'Request a marketing consultation', extra = null, source = 'Consultation form' }) {
  const { settings, groupedCategories, getCategory, addEnquiry } = useData()
  const [form, setForm] = useState({ name: '', business: '', whatsapp: '', categoryId: '', city: '', notes: '', consent: false })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(null)

  const category = form.categoryId ? getCategory(form.categoryId) : null
  const number = resolveWhatsappNumber(category, settings)

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

    const notes = [extra?.value, form.notes.trim()].filter(Boolean).join(' · ')
    const payload = {
      owner: form.name.trim(),
      business: form.business.trim(),
      mobile: form.whatsapp.replace(/\D/g, ''),
      whatsapp: form.whatsapp.replace(/\D/g, ''),
      categoryId: form.categoryId,
      city: form.city.trim(),
      state: '',
      plan: '',
      service: 'Digital Marketing Consultation',
      message: notes,
      routedTo: number,
      routedTeam: category?.team || 'Default',
      source,
    }
    const link = whatsappLink(
      number,
      buildEnquiryMessage(
        {
          name: form.name.trim(),
          business: form.business.trim(),
          mobile: form.whatsapp.replace(/\D/g, ''),
          category: category?.name,
          service: 'Digital Marketing Consultation',
          location: form.city.trim(),
          notes,
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

  if (sent) {
    return (
      <div className="py-6 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
          <IconCheck className="h-7 w-7" />
        </span>
        <p className="mt-4 text-lg font-bold">Enquiry {sent.id} is ready in WhatsApp</p>
                {sent.error && (
                  <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                    Your message is ready in WhatsApp, but we could not save a copy to the admin panel: {sent.error}
                  </p>
                )}
        <p className="muted mt-1 text-sm">Review the message and tap Send.</p>
        <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
          <a href={sent.link} target="_blank" rel="noreferrer" className="btn-whatsapp">
            <IconWhatsApp /> Open WhatsApp again
          </a>
          <button type="button" className="btn-outline" onClick={() => setSent(null)}>
            New enquiry
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate>
      <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl">{title}</h2>
      {extra?.node}
      <div className="mt-4 grid gap-3">
        <Input placeholder="Your name" value={form.name} onChange={set('name')} error={errors.name} />
        <Input placeholder="Business name" value={form.business} onChange={set('business')} error={errors.business} />
        <Input
          placeholder="WhatsApp number"
          inputMode="numeric"
          maxLength={10}
          value={form.whatsapp}
          onChange={(e) => set('whatsapp')(e.target.value.replace(/\D/g, '').slice(0, 10))}
          error={errors.whatsapp}
        />
        <div>
          <select className="field" value={form.categoryId} onChange={set('categoryId')} aria-label="Rental category">
            <option value="">Rental category</option>
            {groupedCategories.map((g) => (
              <optgroup key={g.id} label={g.name}>
                {g.items.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </optgroup>
            ))}
          </select>
          {errors.categoryId && <span className="mt-1 block text-xs font-medium text-red-600">{errors.categoryId}</span>}
        </div>
        <Input placeholder="City / service area" value={form.city} onChange={set('city')} />
        <textarea className="field min-h-[84px] resize-y" placeholder="How can we help?" value={form.notes} onChange={set('notes')} aria-label="How can we help?" />
        <label className="flex items-start gap-2.5 text-sm text-ink/70">
          <input type="checkbox" className="mt-0.5 h-4 w-4 accent-brand-600" checked={form.consent} onChange={set('consent')} />
          <span>
            I agree to be contacted about my enquiry.
            {errors.consent && <span className="block text-xs font-medium text-red-600">{errors.consent}</span>}
          </span>
        </label>
        <button type="submit" className="btn-primary w-full py-3">
          Send Enquiry <IconArrowRight className="h-4 w-4" />
        </button>
        <p className="text-center text-[11px] text-ink/45">
          Opens WhatsApp {category ? `for our ${category.name} team` : 'with our team'} · {prettyPhone(number)}
        </p>
      </div>
    </form>
  )
}

function Input({ error, ...props }) {
  return (
    <div>
      <input className="field" aria-label={props.placeholder} {...props} />
      {error && <span className="mt-1 block text-xs font-medium text-red-600">{error}</span>}
    </div>
  )
}
