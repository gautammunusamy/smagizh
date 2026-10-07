import { useEffect, useState } from 'react'
import { AdminPageHeader } from './AdminLayout'
import { Tabs, Toggle } from './ui'
import { IconTile } from '../components/AppIcon'
import { useData } from '../context/DataContext'
import { CATEGORY_GROUPS, TEAMS } from '../data/seed'
import { prettyPhone } from '../utils/format'
import { buildQuickMessage, digitsOnly, whatsappLink } from '../utils/whatsapp'
import { IconCheck, IconSave, IconWhatsApp } from '../components/Icons'

const snapshot = (list) => Object.fromEntries(list.map((x) => [x.id, { whatsapp: x.whatsapp || '', team: x.team || 'Default' }]))

export default function AdminRouting() {
  const { categories, categoryApi, services, serviceApi, settings, updateSettings } = useData()
  const [tab, setTab] = useState('categories')
  const [catDraft, setCatDraft] = useState({})
  const [svcDraft, setSvcDraft] = useState({})
  const [defaultNumber, setDefaultNumber] = useState(settings.defaultWhatsapp)
  const [saved, setSaved] = useState(false)

  useEffect(() => setCatDraft(snapshot(categories)), [categories])
  useEffect(() => setSvcDraft(snapshot(services)), [services])

  const changed = (list, draft, withTeam) =>
    list.filter((x) => {
      const d = draft[x.id]
      return d && (d.whatsapp !== (x.whatsapp || '') || (withTeam && d.team !== (x.team || 'Default')))
    })

  const dirty =
    defaultNumber !== settings.defaultWhatsapp ||
    changed(categories, catDraft, true).length > 0 ||
    changed(services, svcDraft, false).length > 0

  const saveAll = () => {
    changed(categories, catDraft, true).forEach((c) =>
      categoryApi.update(c.id, { whatsapp: digitsOnly(catDraft[c.id].whatsapp), team: catDraft[c.id].team }),
    )
    changed(services, svcDraft, false).forEach((s) => serviceApi.update(s.id, { whatsapp: digitsOnly(svcDraft[s.id].whatsapp) }))
    updateSettings({ defaultWhatsapp: digitsOnly(defaultNumber) })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const reset = () => {
    setCatDraft(snapshot(categories))
    setSvcDraft(snapshot(services))
    setDefaultNumber(settings.defaultWhatsapp)
  }

  const routed = (n) => digitsOnly(n) || digitsOnly(defaultNumber)

  return (
    <>
      <AdminPageHeader
        title="WhatsApp Routing"
        subtitle="Assign a WhatsApp number to each category (and optionally each service). Anything without a number falls back to the default."
      />

      <div className="card mb-5 flex flex-col gap-4 p-5 sm:flex-row sm:items-end sm:justify-between">
        <label className="block sm:max-w-xs">
          <span className="label">Fallback number (default)</span>
          <input className="field" value={defaultNumber} onChange={(e) => setDefaultNumber(e.target.value.replace(/\D/g, ''))} placeholder="919884500063" />
          <span className="mt-1 block text-[11px] text-ink/45">{prettyPhone(defaultNumber)} · include the country code (91)</span>
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <p className="muted max-w-sm text-xs">
            Routing order: category number → service number → this default number. Enquiry messages always include the selected
            category, rental types, plan and service.
          </p>
          <a href={whatsappLink(defaultNumber, buildQuickMessage(settings.name))} target="_blank" rel="noreferrer" className="btn-outline btn-sm w-fit">
            <IconWhatsApp className="h-4 w-4 text-[#25D366]" /> Test default
          </a>
        </div>
      </div>

      <Tabs
        value={tab}
        onChange={setTab}
        tabs={[
          { id: 'categories', label: 'Rental categories', count: categories.length },
          { id: 'services', label: 'Services', count: services.length },
        ]}
      />

      <div className="card mt-4 overflow-hidden">
        <div className="scroll-thin overflow-x-auto">
          {tab === 'categories' ? (
            <table className="w-full min-w-[920px] text-sm">
              <thead>
                <tr className="border-b border-black/5 bg-black/[.02]">
                  <th className="table-head px-5 py-3 text-left">Category</th>
                  <th className="table-head px-5 py-3 text-left">Assigned Team</th>
                  <th className="table-head px-5 py-3 text-left">WhatsApp Number</th>
                  <th className="table-head px-5 py-3 text-left">Routes To</th>
                  <th className="table-head px-5 py-3 text-left">Status</th>
                  <th className="table-head px-5 py-3 text-right">Test</th>
                </tr>
              </thead>
              <tbody>
                {CATEGORY_GROUPS.map((g) => {
                  const list = categories.filter((c) => c.group === g.id)
                  if (!list.length) return null
                  return [
                    <tr key={g.id} className="bg-brand-50/50">
                      <td colSpan={6} className="kicker px-5 py-2">{g.name}</td>
                    </tr>,
                    ...list.map((c) => {
                      const d = catDraft[c.id] || { whatsapp: '', team: 'Default' }
                      return (
                        <tr key={c.id} className="border-b border-black/5 last:border-0 hover:bg-black/[.015]">
                          <td className="px-5 py-3">
                            <span className="flex items-center gap-2.5 font-medium">
                              <IconTile icon={c.icon} color={c.color} image={c.image} size="xs" />
                              {c.name}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <select className="field py-2" value={d.team} onChange={(e) => setCatDraft((x) => ({ ...x, [c.id]: { ...d, team: e.target.value } }))}>
                              {TEAMS.map((t) => (
                                <option key={t}>{t}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-5 py-3">
                            <input
                              className="field py-2"
                              inputMode="numeric"
                              placeholder={`${defaultNumber} (default)`}
                              value={d.whatsapp}
                              onChange={(e) => setCatDraft((x) => ({ ...x, [c.id]: { ...d, whatsapp: e.target.value.replace(/\D/g, '') } }))}
                            />
                          </td>
                          <td className="whitespace-nowrap px-5 py-3 text-xs">
                            {prettyPhone(routed(d.whatsapp))}
                            {!d.whatsapp && <span className="ml-1 text-[11px] text-amber-600">(default)</span>}
                          </td>
                          <td className="px-5 py-3">
                            <span className="flex items-center gap-2">
                              <Toggle checked={c.active} onChange={() => categoryApi.toggle(c.id)} label={`Toggle ${c.name}`} />
                              <span className={c.active ? 'badge-active' : 'badge-inactive'}>{c.active ? 'Live' : 'Hidden'}</span>
                            </span>
                          </td>
                          <td className="px-5 py-3 text-right">
                            <TestLink number={routed(d.whatsapp)} message={buildQuickMessage(settings.name, c.name)} label={c.name} />
                          </td>
                        </tr>
                      )
                    }),
                  ]
                })}
              </tbody>
            </table>
          ) : (
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-black/5 bg-black/[.02]">
                  <th className="table-head px-5 py-3 text-left">Service</th>
                  <th className="table-head px-5 py-3 text-left">WhatsApp Number</th>
                  <th className="table-head px-5 py-3 text-left">Routes To</th>
                  <th className="table-head px-5 py-3 text-right">Test</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => {
                  const d = svcDraft[s.id] || { whatsapp: '' }
                  return (
                    <tr key={s.id} className="border-b border-black/5 last:border-0 hover:bg-black/[.015]">
                      <td className="px-5 py-3">
                        <span className="flex items-center gap-2.5 font-medium">
                          <IconTile icon={s.icon} color={s.color} image={s.image} size="xs" />
                          {s.name}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <input
                          className="field py-2"
                          inputMode="numeric"
                          placeholder={`${defaultNumber} (default)`}
                          value={d.whatsapp}
                          onChange={(e) => setSvcDraft((x) => ({ ...x, [s.id]: { ...d, whatsapp: e.target.value.replace(/\D/g, '') } }))}
                        />
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-xs">
                        {prettyPhone(routed(d.whatsapp))}
                        {!d.whatsapp && <span className="ml-1 text-[11px] text-amber-600">(default)</span>}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <TestLink number={routed(d.whatsapp)} message={buildQuickMessage(settings.name, null, s.name)} label={s.name} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-black/5 p-5">
          {saved ? (
            <span className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
              <IconCheck className="h-4 w-4" /> Routing saved — the public site now uses these numbers.
            </span>
          ) : (
            <span className="muted text-sm">{dirty ? 'You have unsaved routing changes.' : 'All routing is up to date.'}</span>
          )}
          <div className="flex gap-3">
            <button type="button" className="btn-outline btn-sm" onClick={reset} disabled={!dirty}>
              Reset Changes
            </button>
            <button type="button" className="btn-primary btn-sm" onClick={saveAll} disabled={!dirty}>
              <IconSave className="h-4 w-4" /> Save Routing Changes
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

function TestLink({ number, message, label }) {
  return (
    <a
      href={whatsappLink(number, message)}
      target="_blank"
      rel="noreferrer"
      title={`Open WhatsApp for ${label}`}
      className="inline-grid h-9 w-9 place-items-center rounded-lg border border-black/10 text-[#25D366] transition hover:bg-emerald-50"
    >
      <IconWhatsApp className="h-4 w-4" />
    </a>
  )
}
