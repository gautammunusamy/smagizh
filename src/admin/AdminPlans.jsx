import { useEffect, useState } from 'react'
import { AdminPageHeader } from './AdminLayout'
import Modal from '../components/Modal'
import { ColorPicker, Field, Group, IconButton, IconPicker, ListEditor, OrderButtons, Toggle } from './ui'
import { IconTile } from '../components/AppIcon'
import { useData } from '../context/DataContext'
import { rupees, rupeesExact, discounted, uid } from '../utils/format'
import { IconCheck, IconEdit, IconPlus, IconSave, IconTrash } from '../components/Icons'

const BLANK = {
  name: '',
  short: '',
  tagline: '',
  icon: 'rocket',
  color: 'violet',
  price: 0,
  adBudget: 0,
  description: '',
  categoryNote: '',
  features: [''],
  scope: [''],
  freeFeatures: [],
  free: false,
  showOnCategory: true,
  recommended: false,
  active: true,
  order: 99,
}

export default function AdminPlans() {
  const { plans, planApi, comparison, setComparison, settings, updateSettings } = useData()
  const [editing, setEditing] = useState(null)
  const [disc, setDisc] = useState({ monthly: settings.monthlyDiscount ?? 5, annual: settings.annualDiscount ?? 20 })
  const [copy, setCopy] = useState({
    trialPoints: settings.trialPoints || [],
    pricingNotes: settings.pricingNotes || [],
    pricingFootnote: settings.pricingFootnote || '',
  })
  const [savedCopy, setSavedCopy] = useState(false)
  const [rows, setRows] = useState(comparison)
  const [savedRows, setSavedRows] = useState(false)
  const compared = plans

  useEffect(() => setRows(comparison), [comparison])

  const patch = (p) => setEditing((x) => ({ ...x, ...p }))

  const save = (e) => {
    e.preventDefault()
    if (!editing.name.trim()) return
    const payload = {
      ...editing,
      price: Number(editing.price) || 0,
      adBudget: Number(editing.adBudget) || 0,
      features: (editing.features || []).filter(Boolean),
      scope: (editing.scope || []).filter(Boolean),
      freeFeatures: (editing.freeFeatures || []).filter(Boolean),
    }
    if (payload.id) planApi.update(payload.id, payload)
    else planApi.add(payload)
    setEditing(null)
  }

  const saveRows = () => {
    setComparison(rows.filter((r) => r.label.trim()))
    setSavedRows(true)
    setTimeout(() => setSavedRows(false), 2500)
  }

  return (
    <>
      <AdminPageHeader title="Promotional Plans" subtitle="Any change here reflects on the Plans page, the Home page and every category page immediately.">
        <button type="button" className="btn-primary btn-sm" onClick={() => setEditing({ ...BLANK, order: plans.length + 1 })}>
          <IconPlus className="h-4 w-4" /> Add New Plan
        </button>
      </AdminPageHeader>

      <div className="card mb-5 p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold">Plans page content</h2>
            <p className="muted text-sm">Discounts, the free-trial box and the “Clear pricing” notes shown on the Home and Plans pages.</p>
          </div>
          {savedCopy && (
            <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
              <IconCheck className="h-4 w-4" /> Saved
            </span>
          )}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Monthly billing discount (%)">
              <input className="field" type="number" min="0" max="90" value={disc.monthly} onChange={(e) => setDisc((d) => ({ ...d, monthly: e.target.value }))} />
            </Field>
            <Field label="Annual upfront discount (%)">
              <input className="field" type="number" min="0" max="90" value={disc.annual} onChange={(e) => setDisc((d) => ({ ...d, annual: e.target.value }))} />
            </Field>
            <Group label="Free-trial box points" className="sm:col-span-2">
              <ListEditor items={copy.trialPoints} onChange={(trialPoints) => setCopy((c) => ({ ...c, trialPoints }))} placeholder="Add trial point" />
            </Group>
          </div>
          <div className="grid gap-4">
            <Group label="“Clear pricing. No surprises.” notes">
              <ListEditor items={copy.pricingNotes} onChange={(pricingNotes) => setCopy((c) => ({ ...c, pricingNotes }))} placeholder="Add note" />
            </Group>
            <Field label="Footnote under the notes">
              <input className="field" value={copy.pricingFootnote} onChange={(e) => setCopy((c) => ({ ...c, pricingFootnote: e.target.value }))} />
            </Field>
          </div>
        </div>

        <button
          type="button"
          className="btn-primary btn-sm mt-4"
          onClick={() => {
            updateSettings({
              monthlyDiscount: Number(disc.monthly) || 0,
              annualDiscount: Number(disc.annual) || 0,
              trialPoints: copy.trialPoints.filter(Boolean),
              pricingNotes: copy.pricingNotes.filter(Boolean),
              pricingFootnote: copy.pricingFootnote,
            })
            setSavedCopy(true)
            setTimeout(() => setSavedCopy(false), 2500)
          }}
        >
          <IconSave className="h-4 w-4" /> Save plans page content
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="scroll-thin overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead>
              <tr className="border-b border-black/5 bg-black/[.02]">
                <th className="table-head px-5 py-3 text-left">Plan</th>
                <th className="table-head px-5 py-3 text-left">Standard / month</th>
                <th className="table-head px-5 py-3 text-left">Monthly · Annual</th>
                <th className="table-head px-5 py-3 text-left">Category-page features</th>
                <th className="table-head px-5 py-3 text-left">Status</th>
                <th className="table-head px-5 py-3 text-left">Order</th>
                <th className="table-head px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((p) => (
                <tr key={p.id} className="border-b border-black/5 align-top last:border-0 hover:bg-black/[.015]">
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-3">
                      <IconTile icon={p.icon} color={p.color} size="xs" />
                      <span>
                        <span className="block font-semibold">{p.name}</span>
                        <span className="muted block text-xs">
                          {p.tagline}
                          {p.recommended && ' · Recommended'}
                          {p.free && ' · Free'}
                        </span>
                      </span>
                    </span>
                  </td>
                  <td className="px-5 py-4 font-semibold">{rupees(p.price)}</td>
                  <td className="muted px-5 py-4 text-xs">
                    {p.free ? '—' : `${rupeesExact(discounted(p.price, settings.monthlyDiscount))} · ${rupeesExact(discounted(p.price, settings.annualDiscount))}`}
                  </td>
                  <td className="px-5 py-4">
                    {p.showOnCategory === false ? (
                      <span className="muted text-xs">Not shown on category pages</span>
                    ) : (
                      <ul className="muted list-disc space-y-0.5 pl-4 text-xs">
                        {(p.features || []).slice(0, 4).map((f) => (
                          <li key={f}>{f}</li>
                        ))}
                        {(p.features || []).length > 4 && <li>+{p.features.length - 4} more</li>}
                      </ul>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <span className="flex items-center gap-2">
                      <Toggle checked={p.active} onChange={() => planApi.toggle(p.id)} label={`Toggle ${p.name}`} />
                      <span className={p.active ? 'badge-active' : 'badge-inactive'}>{p.active ? 'Active' : 'Hidden'}</span>
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <OrderButtons onUp={() => planApi.move(p.id, 'up')} onDown={() => planApi.move(p.id, 'down')} />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <IconButton tone="brand" title="Edit" onClick={() => setEditing({ ...BLANK, ...p })}>
                        <IconEdit className="h-4 w-4" />
                      </IconButton>
                      <IconButton tone="danger" title="Delete" onClick={() => window.confirm(`Delete "${p.name}"?`) && planApi.remove(p.id)}>
                        <IconTrash className="h-4 w-4" />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* comparison table editor */}
      <div className="card mt-5 overflow-hidden">
        <div className="flex flex-col gap-2 border-b border-black/5 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold">Plan comparison table</h2>
            <p className="muted text-sm">Rows shown under “Find the right support for your rental business” on the Plans page.</p>
          </div>
          <div className="flex items-center gap-3">
            {savedRows && (
              <span className="flex items-center gap-1.5 text-sm font-semibold text-emerald-600">
                <IconCheck className="h-4 w-4" /> Saved
              </span>
            )}
            <button type="button" className="btn-primary btn-sm" onClick={saveRows}>
              <IconSave className="h-4 w-4" /> Save table
            </button>
          </div>
        </div>
        <div className="scroll-thin overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="border-b border-black/5 bg-black/[.02]">
                <th className="table-head px-4 py-3 text-left">Feature</th>
                {compared.map((p) => (
                  <th key={p.id} className="table-head px-4 py-3 text-left">{p.name}</th>
                ))}
                <th className="table-head px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id} className="border-b border-black/5 last:border-0">
                  <td className="px-4 py-2">
                    <input className="field py-2" value={r.label} onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} />
                  </td>
                  {compared.map((p) => (
                    <td key={p.id} className="px-4 py-2">
                      <input
                        className="field py-2"
                        value={r.values?.[p.id] || ''}
                        onChange={(e) => setRows(rows.map((x, j) => (j === i ? { ...x, values: { ...x.values, [p.id]: e.target.value } } : x)))}
                      />
                    </td>
                  ))}
                  <td className="px-4 py-2 text-right">
                    <IconButton tone="danger" title="Delete row" onClick={() => setRows(rows.filter((_, j) => j !== i))}>
                      <IconTrash className="h-4 w-4" />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-black/5 p-4">
          <button type="button" className="btn-outline btn-sm" onClick={() => setRows([...rows, { id: uid('row'), label: '', values: {} }])}>
            <IconPlus className="h-4 w-4" /> Add row
          </button>
        </div>
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} size="lg">
        {editing && (
          <form onSubmit={save}>
            <div className="flex items-center gap-3 border-b border-black/5 p-6 pr-16">
              <IconTile icon={editing.icon} color={editing.color} size="sm" />
              <h2 className="text-xl font-bold">{editing.id ? 'Edit Plan' : 'Add Plan'}</h2>
            </div>

            <div className="grid gap-4 p-6 sm:grid-cols-2">
              <Field label="Plan Name" required>
                <input className="field" value={editing.name} onChange={(e) => patch({ name: e.target.value })} />
              </Field>
              <Field label="Short name" hint='Used on buttons, e.g. "Choose Basic".'>
                <input className="field" value={editing.short} onChange={(e) => patch({ short: e.target.value })} />
              </Field>
              <Field label="Tagline" hint="e.g. Local Starter">
                <input className="field" value={editing.tagline} onChange={(e) => patch({ tagline: e.target.value })} />
              </Field>
              <Field label="Display Order">
                <input className="field" type="number" value={editing.order} onChange={(e) => patch({ order: Number(e.target.value) })} />
              </Field>
              <Group label="Icon">
                <IconPicker value={editing.icon} color={editing.color} onChange={(icon) => patch({ icon })} />
              </Group>
              <Group label="Icon colour">
                <ColorPicker value={editing.color} onChange={(color) => patch({ color })} />
              </Group>
              <Field label="Standard service fee (₹ / month)" required>
                <input className="field" type="number" min="0" value={editing.price} onChange={(e) => patch({ price: e.target.value })} />
              </Field>
              <Field label="Example ad budget (₹ / month)" hint="Shown on category pages; 0 hides it.">
                <input className="field" type="number" min="0" value={editing.adBudget} onChange={(e) => patch({ adBudget: e.target.value })} />
              </Field>
              <Field label="Plans-page description" className="sm:col-span-2">
                <input className="field" value={editing.description} onChange={(e) => patch({ description: e.target.value })} />
              </Field>
              <Field label="Category-page one-liner" hint="e.g. Build your local presence" className="sm:col-span-2">
                <input className="field" value={editing.categoryNote} onChange={(e) => patch({ categoryNote: e.target.value })} />
              </Field>
              <Group label="Category-page points (3 recommended)">
                <ListEditor items={editing.features || []} onChange={(features) => patch({ features })} placeholder="Add feature" />
              </Group>
              <Group label="Included service scope (Plans page)">
                <ListEditor items={editing.scope || []} onChange={(scope) => patch({ scope })} placeholder="Add scope item" />
              </Group>
              {editing.free && (
                <Group label="Forever-free features" className="sm:col-span-2">
                  <ListEditor items={editing.freeFeatures || []} onChange={(freeFeatures) => patch({ freeFeatures })} placeholder="Add item" />
                </Group>
              )}

              <div className="grid gap-3 sm:col-span-2 sm:grid-cols-2">
                {[
                  ['free', 'Free plan (no charge)'],
                  ['showOnCategory', 'Show on category pages'],
                  ['recommended', 'Mark as Recommended / Most Popular'],
                  ['active', 'Show on the website'],
                ].map(([k, label]) => (
                  <span key={k} className="flex items-center gap-3">
                    <Toggle checked={editing[k] !== false && !!editing[k]} onChange={(v) => patch({ [k]: v })} label={label} />
                    <span className="text-sm font-medium">{label}</span>
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-black/5 p-6">
              <button type="button" className="btn-ghost" onClick={() => setEditing(null)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {editing.id ? 'Save Changes' : 'Add Plan'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  )
}
