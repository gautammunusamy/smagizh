import { useEffect, useState } from 'react'
import { AdminPageHeader } from './AdminLayout'
import Logo from '../components/Logo'
import { Field } from './ui'
import { useData } from '../context/DataContext'
import { useAuth } from '../context/AuthContext'
import { prettyPhone } from '../utils/format'
import { IconCheck, IconSave } from '../components/Icons'

export default function AdminSettings() {
  const { settings, updateSettings } = useData()
  const [form, setForm] = useState(settings)
  const [saved, setSaved] = useState(false)

  // settings load from the API after the first render
  useEffect(() => setForm(settings), [settings])

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const setSocial = (k) => (e) => setForm((f) => ({ ...f, social: { ...f.social, [k]: e.target.value } }))

  const [error, setError] = useState('')

  const save = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await updateSettings({ ...form, defaultWhatsapp: String(form.defaultWhatsapp).replace(/\D/g, '') })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <AdminPageHeader title="Settings" subtitle="Business identity, contact details and the default WhatsApp routing number." />

      <form onSubmit={save} className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <div className="card p-6">
            <h2 className="font-bold">Business Identity</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Website / Business Name" required>
                <input className="field" value={form.name} onChange={set('name')} />
              </Field>
              <Field label="Legal Name">
                <input className="field" value={form.legalName} onChange={set('legalName')} />
              </Field>
              <Field label="Short brand name" hint="Used in WhatsApp messages, e.g. “Hello Smagizh”.">
                <input className="field" value={form.shortName || ''} onChange={set('shortName')} />
              </Field>
              <Field label="Tagline" className="sm:col-span-2">
                <input className="field" value={form.tagline} onChange={set('tagline')} />
              </Field>
              <Field
                label="Home Banner Text"
                className="sm:col-span-2"
                hint="The paragraph under the heading on the home page banner."
              >
                <textarea className="field min-h-[70px]" value={form.heroSubtitle || ''} onChange={set('heroSubtitle')} />
              </Field>
              <Field label="Footer Description" className="sm:col-span-2">
                <textarea className="field min-h-[80px]" value={form.description} onChange={set('description')} />
              </Field>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-bold">Contact & Routing</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field
                label="Default WhatsApp Number"
                required
                hint={`Include country code (91…). Used whenever a category or service has no dedicated number. ${prettyPhone(form.defaultWhatsapp)}`}
              >
                <input
                  className="field"
                  value={form.defaultWhatsapp}
                  onChange={(e) => setForm((f) => ({ ...f, defaultWhatsapp: e.target.value.replace(/\D/g, '') }))}
                />
              </Field>
              <Field label="Phone Number">
                <input className="field" value={form.phone} onChange={set('phone')} />
              </Field>
              <Field label="Email Address">
                <input className="field" type="email" value={form.email} onChange={set('email')} />
              </Field>
              <Field label="Business Hours">
                <input className="field" value={form.hours} onChange={set('hours')} />
              </Field>
              <Field label="Address" className="sm:col-span-2">
                <input className="field" value={form.address} onChange={set('address')} />
              </Field>
              <Field label="City / Region (footer)">
                <input className="field" value={form.city} onChange={set('city')} />
              </Field>
              <Field label="Google Maps URL">
                <input className="field" value={form.mapUrl} onChange={set('mapUrl')} />
              </Field>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-bold">Social Links</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {['facebook', 'instagram', 'linkedin', 'youtube'].map((k) => (
                <Field key={k} label={k[0].toUpperCase() + k.slice(1)}>
                  <input className="field" value={form.social?.[k] || ''} onChange={setSocial(k)} />
                </Field>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="card p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-ink/45">Brand preview</p>
            <div className="mt-4 rounded-2xl border border-black/[.06] p-5">
              <Logo size="lg" />
            </div>
            <div className="mt-3 rounded-2xl bg-ink p-5">
              <Logo variant="dark" size="lg" />
            </div>
            <p className="muted mt-4 text-xs leading-relaxed">
              The approved Smagizh logo (client artwork, transparent background) is used in the header, mobile menu, footer,
              admin login, admin sidebar, browser tab and favicon, always at its original colours and aspect ratio.
            </p>
          </div>

          <div className="card p-6">
            <button type="submit" className="btn-primary w-full">
              <IconSave className="h-4 w-4" /> Save Settings
            </button>
            {saved && (
              <p className="mt-3 flex items-center justify-center gap-2 text-sm font-semibold text-emerald-600">
                <IconCheck className="h-4 w-4" /> Settings saved
              </p>
            )}
            {error && <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
            <p className="muted mt-3 text-xs leading-relaxed">
              Saved to the database, so every visitor sees the change immediately.
            </p>
          </div>

          <ChangePassword />
        </aside>
      </form>
    </>
  )
}

/** Admin → Settings → Change password. */
function ChangePassword() {
  const { changePassword } = useAuth()
  const [form, setForm] = useState({ current: '', next: '', confirm: '' })
  const [state, setState] = useState({ busy: false, error: '', done: false })
  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }))
    setState((s) => ({ ...s, error: '', done: false }))
  }

  const submit = async (e) => {
    e?.preventDefault?.()
    if (form.next.length < 8) return setState({ busy: false, error: 'Use at least 8 characters.', done: false })
    if (form.next !== form.confirm) return setState({ busy: false, error: 'The two new passwords do not match.', done: false })

    setState({ busy: true, error: '', done: false })
    const res = await changePassword(form.current, form.next)
    if (res.ok) {
      setForm({ current: '', next: '', confirm: '' })
      setState({ busy: false, error: '', done: true })
    } else {
      setState({ busy: false, error: res.error, done: false })
    }
  }

  return (
    <div className="card p-6">
      <h2 className="font-bold">Change password</h2>
      <p className="muted mt-1 text-sm">Updates the admin sign-in for /admin.</p>
      <div className="mt-4 space-y-3">
        <Field label="Current password">
          <input className="field" type="password" value={form.current} onChange={set('current')} autoComplete="current-password" />
        </Field>
        <Field label="New password" hint="At least 8 characters.">
          <input className="field" type="password" value={form.next} onChange={set('next')} autoComplete="new-password" />
        </Field>
        <Field label="Confirm new password">
          <input className="field" type="password" value={form.confirm} onChange={set('confirm')} autoComplete="new-password" />
        </Field>
      </div>
      {state.error && <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>}
      {state.done && (
        <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-emerald-600">
          <IconCheck className="h-4 w-4" /> Password changed
        </p>
      )}
      <button type="button" onClick={submit} className="btn-outline mt-4 w-full" disabled={state.busy}>
        {state.busy ? 'Saving…' : 'Update password'}
      </button>
    </div>
  )
}
