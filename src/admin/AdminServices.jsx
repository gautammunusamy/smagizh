import { useState } from 'react'
import { AdminPageHeader } from './AdminLayout'
import Modal from '../components/Modal'
import { ColorPicker, Field, Group, IconButton, IconPicker, ImageInput, ListEditor, OrderButtons, Toggle } from './ui'
import { IconTile } from '../components/AppIcon'
import { useData } from '../context/DataContext'
import { prettyPhone, slugify } from '../utils/format'
import { resolveWhatsappNumber } from '../utils/whatsapp'
import { IconEdit, IconExternal, IconPlus, IconTrash, IconWhatsApp } from '../components/Icons'

const BLANK = {
  name: '',
  slug: '',
  tag: '',
  icon: 'megaphone',
  color: 'violet',
  image: '',
  whatsapp: '',
  description: '',
  overview: '',
  points: [''],
  benefits: [''],
  active: true,
  order: 99,
}

const TIPS = [
  { icon: 'star', color: 'amber', title: 'Showcase what you do best', text: 'Display the services you offer to build trust and attract the right customers.' },
  { icon: 'target', color: 'rose', title: 'Drive better results', text: 'Well-structured services help visitors understand your value instantly.' },
  { icon: 'bolt', color: 'violet', title: 'Stay in control', text: 'Add, edit or reorder services anytime with ease.' },
]

export default function AdminServices() {
  const { services, serviceApi, settings } = useData()
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState('')

  const patch = (p) => setEditing((s) => ({ ...s, ...p }))

  const save = (e) => {
    e.preventDefault()
    if (!editing.name.trim()) return setError('Service name is required.')
    const slug = slugify(editing.slug || editing.name)
    if (services.some((s) => s.slug === slug && s.id !== editing.id)) return setError(`Another service already uses the URL "${slug}".`)
    const payload = {
      ...editing,
      name: editing.name.trim(),
      slug,
      whatsapp: String(editing.whatsapp || '').replace(/\D/g, ''),
      points: (editing.points || []).filter(Boolean),
      benefits: (editing.benefits || []).filter(Boolean),
    }
    if (payload.id) serviceApi.update(payload.id, payload)
    else serviceApi.add(payload)
    setEditing(null)
  }

  return (
    <>
      <AdminPageHeader title="Digital Marketing Services" subtitle="Manage the services, icons and detail pages displayed on your website.">
        <button
          type="button"
          className="btn-primary btn-sm"
          onClick={() => {
            setError('')
            setEditing({ ...BLANK, order: services.length + 1 })
          }}
        >
          <IconPlus className="h-4 w-4" /> Add New Service
        </button>
      </AdminPageHeader>

      <div className="grid gap-4 sm:grid-cols-3">
        {TIPS.map((t) => (
          <div key={t.title} className="card flex items-start gap-3 p-5">
            <IconTile icon={t.icon} color={t.color} size="sm" />
            <div>
              <p className="font-bold">{t.title}</p>
              <p className="muted mt-1 text-sm leading-snug">{t.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card mt-5 overflow-hidden">
        <div className="scroll-thin overflow-x-auto">
          <table className="w-full min-w-[960px] text-sm">
            <thead>
              <tr className="border-b border-black/5 bg-black/[.02]">
                <th className="table-head px-5 py-3 text-left">Service</th>
                <th className="table-head px-5 py-3 text-left">Description</th>
                <th className="table-head px-5 py-3 text-left">WhatsApp</th>
                <th className="table-head px-5 py-3 text-left">Status</th>
                <th className="table-head px-5 py-3 text-left">Order</th>
                <th className="table-head px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.id} className="border-b border-black/5 last:border-0 hover:bg-black/[.015]">
                  <td className="px-5 py-3">
                    <span className="flex items-center gap-3">
                      <IconTile icon={s.icon} color={s.color} image={s.image} size="xs" />
                      <span>
                        <span className="block font-semibold">{s.name}</span>
                        {s.tag && <span className="muted block text-xs">{s.tag}</span>}
                      </span>
                    </span>
                  </td>
                  <td className="muted max-w-sm px-5 py-3">{s.description}</td>
                  <td className="whitespace-nowrap px-5 py-3 text-xs">
                    <span className="inline-flex items-center gap-1.5">
                      <IconWhatsApp className="h-4 w-4 text-[#25D366]" />
                      {prettyPhone(resolveWhatsappNumber(null, settings, s))}
                      {!s.whatsapp && <span className="muted">(default)</span>}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="flex items-center gap-2">
                      <Toggle checked={s.active} onChange={() => serviceApi.toggle(s.id)} label={`Toggle ${s.name}`} />
                      <span className={s.active ? 'badge-active' : 'badge-inactive'}>{s.active ? 'Active' : 'Hidden'}</span>
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <OrderButtons onUp={() => serviceApi.move(s.id, 'up')} onDown={() => serviceApi.move(s.id, 'down')} />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-2">
                      <IconButton
                        tone="brand"
                        title="Edit"
                        onClick={() => {
                          setError('')
                          setEditing({ ...BLANK, ...s, points: [...(s.points || [])], benefits: [...(s.benefits || [])] })
                        }}
                      >
                        <IconEdit className="h-4 w-4" />
                      </IconButton>
                      <a
                        href={`/services/${s.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        title="View on site"
                        className="grid h-9 w-9 place-items-center rounded-lg border border-black/10 text-ink/55 transition hover:bg-black/5"
                      >
                        <IconExternal className="h-4 w-4" />
                      </a>
                      <IconButton tone="danger" title="Delete" onClick={() => window.confirm(`Delete "${s.name}"?`) && serviceApi.remove(s.id)}>
                        <IconTrash className="h-4 w-4" />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="border-t border-black/5 bg-brand-50 px-5 py-3 text-xs text-brand-800">
          Only active services are shown on your public website. Reorder to highlight your most important offerings — the first six
          appear on the Home page.
        </p>
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} size="lg">
        {editing && (
          <form onSubmit={save}>
            <div className="flex items-center gap-3 border-b border-black/5 p-6 pr-16">
              <IconTile icon={editing.icon} color={editing.color} image={editing.image} size="sm" />
              <h2 className="text-xl font-bold">{editing.id ? 'Edit Service' : 'Add Service'}</h2>
            </div>
            <div className="grid gap-4 p-6 sm:grid-cols-2">
              <Field label="Service Name" required>
                <input className="field" value={editing.name} onChange={(e) => patch({ name: e.target.value })} />
              </Field>
              <Field label="URL Slug" hint="Leave blank to generate from the name.">
                <input className="field" value={editing.slug} placeholder={slugify(editing.name)} onChange={(e) => patch({ slug: e.target.value })} />
              </Field>
              <Field label="Tag" hint="Small label on the card, e.g. Paid Social.">
                <input className="field" value={editing.tag} onChange={(e) => patch({ tag: e.target.value })} />
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
              <Group label="Service image (optional)" hint="Replaces the icon on the card and detail page." className="sm:col-span-2">
                <ImageInput value={editing.image} onChange={(image) => patch({ image })} onError={setError} />
              </Group>
              <Field label="Short description" hint="Card text." className="sm:col-span-2">
                <textarea className="field min-h-[60px]" value={editing.description} onChange={(e) => patch({ description: e.target.value })} />
              </Field>
              <Field label="Detailed description" hint="Service detail page." className="sm:col-span-2">
                <textarea className="field min-h-[100px]" value={editing.overview} onChange={(e) => patch({ overview: e.target.value })} />
              </Field>
              <Group label="Key features">
                <ListEditor items={editing.points || []} onChange={(points) => patch({ points })} placeholder="Add feature" />
              </Group>
              <Group label="Benefits">
                <ListEditor items={editing.benefits || []} onChange={(benefits) => patch({ benefits })} placeholder="Add benefit" />
              </Group>
              <Field
                label="Service WhatsApp number (optional)"
                hint={`Used when a customer enquires about this service without a category number. Empty = default ${prettyPhone(settings.defaultWhatsapp)}.`}
                className="sm:col-span-2"
              >
                <input
                  className="field"
                  inputMode="numeric"
                  placeholder={`${settings.defaultWhatsapp} (default)`}
                  value={editing.whatsapp}
                  onChange={(e) => patch({ whatsapp: e.target.value.replace(/\D/g, '') })}
                />
              </Field>
              <div className="flex items-center gap-3 sm:col-span-2">
                <Toggle checked={editing.active} onChange={(v) => patch({ active: v })} label="Active" />
                <span className="text-sm font-medium">Show this service on the public website</span>
              </div>
              {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600 sm:col-span-2">{error}</p>}
            </div>
            <div className="flex justify-end gap-3 border-t border-black/5 p-6">
              <button type="button" className="btn-ghost" onClick={() => setEditing(null)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {editing.id ? 'Save Changes' : 'Add Service'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  )
}
