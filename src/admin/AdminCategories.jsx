import { useMemo, useState } from 'react'
import { AdminPageHeader } from './AdminLayout'
import Modal from '../components/Modal'
import { ColorPicker, Field, Group, IconButton, IconPicker, ImageInput, ListEditor, OrderButtons, Tabs, Toggle } from './ui'
import { IconTile } from '../components/AppIcon'
import { useData } from '../context/DataContext'
import { CATEGORY_GROUPS, TEAMS } from '../data/seed'
import { prettyPhone, slugify, uid } from '../utils/format'
import { resolveWhatsappNumber } from '../utils/whatsapp'
import { IconEdit, IconExternal, IconPlus, IconSearch, IconTrash, IconWhatsApp } from '../components/Icons'

const FEATURE_DEFAULTS = [
  { icon: 'map-pin', color: 'violet', title: 'Get discovered', text: 'Local search and location-focused campaigns.' },
  { icon: 'users', color: 'pink', title: 'Attract enquiries', text: 'Promote your rental types, plans and offers.' },
  { icon: 'whatsapp', color: 'green', title: 'Follow up faster', text: 'WhatsApp enquiries and organised lead follow-up.' },
  { icon: 'chart', color: 'blue', title: 'Track what converts', text: 'Measure enquiries, bookings and campaign spend.' },
]

const BLANK = {
  name: '',
  slug: '',
  icon: 'box',
  color: 'violet',
  image: '',
  banner: '',
  group: CATEGORY_GROUPS[0].id,
  team: 'Default',
  whatsapp: '',
  short: '',
  headline: 'More customers. More rental bookings.',
  intro: '',
  overview: '',
  highlights: [
    { title: 'Reach local customers', text: 'Targeted campaigns for your city.' },
    { title: 'Get more enquiries', text: 'Turn interest into rental bookings.' },
    { title: 'Grow your rental business', text: 'More visibility. More customers.' },
  ],
  typeLabel: 'rental types',
  noun: 'rental',
  inventoryLabel: 'Inventory size',
  inventoryPlaceholder: 'e.g. 20 items',
  features: FEATURE_DEFAULTS,
  channels: ['Google Search Ads', 'Meta Ads', 'Google Business Profile', 'Local SEO', 'WhatsApp Follow-up'],
  supportSub: 'Reach the right customers and make every enquiry easier to manage.',
  builtFor: 'We plan around your rental types, service area, availability and offers, then route enquiries to your team.',
  benefits: ['Local audience research', 'Relevant keywords and creatives', 'Seasonal offers and location-focused promotion'],
  role: ['Keep prices and availability current', 'Reply to enquiries promptly', 'Record confirmed bookings'],
  outcomes: ['Qualified enquiries', 'Confirmed bookings and revenue', 'Cost per enquiry and booking'],
  subcategories: [],
  active: true,
  order: 99,
}

const groupName = (id) => CATEGORY_GROUPS.find((g) => g.id === id)?.name || id

export default function AdminCategories() {
  const { categories, categoryApi, settings } = useData()
  const [editing, setEditing] = useState(null)
  const [tab, setTab] = useState('basics')
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('all')
  const [q, setQ] = useState('')

  const rows = useMemo(
    () =>
      categories.filter(
        (c) =>
          (filter === 'all' || c.group === filter) &&
          (!q.trim() ||
            c.name.toLowerCase().includes(q.trim().toLowerCase()) ||
            (c.subcategories || []).some((s) => s.name.toLowerCase().includes(q.trim().toLowerCase()))),
      ),
    [categories, filter, q],
  )
  const totalSubs = categories.reduce((n, c) => n + (c.subcategories || []).length, 0)

  const open = (c) => {
    setError('')
    setTab('basics')
    setEditing(JSON.parse(JSON.stringify(c)))
  }
  const openNew = () => open({ ...BLANK, order: categories.length + 1 })

  const patch = (p) => setEditing((c) => ({ ...c, ...p }))

  const save = (e) => {
    e.preventDefault()
    if (!editing.name.trim()) {
      setTab('basics')
      return setError('Category name is required.')
    }
    const slug = slugify(editing.slug || editing.name)
    if (categories.some((c) => c.slug === slug && c.id !== editing.id)) {
      setTab('basics')
      return setError(`Another category already uses the URL "${slug}".`)
    }
    const payload = {
      ...editing,
      name: editing.name.trim(),
      slug,
      whatsapp: String(editing.whatsapp || '').replace(/\D/g, ''),
      subcategories: (editing.subcategories || []).filter((s) => s.name.trim()).map((s) => ({ ...s, name: s.name.trim() })),
      channels: (editing.channels || []).filter(Boolean),
      benefits: (editing.benefits || []).filter(Boolean),
      role: (editing.role || []).filter(Boolean),
      outcomes: (editing.outcomes || []).filter(Boolean),
    }
    if (payload.id) categoryApi.update(payload.id, payload)
    else categoryApi.add(payload)
    setEditing(null)
  }

  const remove = (c) => {
    if (window.confirm(`Delete "${c.name}"? This removes it and its ${c.subcategories?.length || 0} subcategories from the public website.`))
      categoryApi.remove(c.id)
  }

  return (
    <>
      <AdminPageHeader
        title="Rental Categories"
        subtitle={`${categories.length} categories · ${totalSubs} subcategories. Edit content, icons, subcategories and WhatsApp routing — changes go live on the site immediately.`}
      >
        <button type="button" className="btn-primary btn-sm" onClick={openNew}>
          <IconPlus className="h-4 w-4" /> Add Category
        </button>
      </AdminPageHeader>

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative lg:w-80">
          <IconSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
          <input className="field pl-10" placeholder="Search categories or subcategories" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Tabs
          value={filter}
          onChange={setFilter}
          tabs={[{ id: 'all', label: 'All', count: categories.length }, ...CATEGORY_GROUPS.map((g) => ({ id: g.id, label: g.name, count: categories.filter((c) => c.group === g.id).length }))]}
        />
      </div>

      <div className="card overflow-hidden">
        <div className="scroll-thin overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead>
              <tr className="border-b border-black/5 bg-black/[.02]">
                <th className="table-head px-5 py-3 text-left">Category</th>
                <th className="table-head px-5 py-3 text-left">Subcategories</th>
                <th className="table-head px-5 py-3 text-left">Assigned Team</th>
                <th className="table-head px-5 py-3 text-left">WhatsApp Number</th>
                <th className="table-head px-5 py-3 text-left">Visible on Site</th>
                <th className="table-head px-5 py-3 text-left">Order</th>
                <th className="table-head px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => {
                const subs = c.subcategories || []
                const live = subs.filter((s) => s.active !== false).length
                return (
                  <tr key={c.id} className="border-b border-black/5 last:border-0 hover:bg-black/[.015]">
                    <td className="px-5 py-3">
                      <span className="flex items-center gap-3">
                        <IconTile icon={c.icon} color={c.color} image={c.image} size="xs" />
                        <span>
                          <span className="block font-semibold">{c.name}</span>
                          <span className="muted block text-xs">{groupName(c.group)}</span>
                        </span>
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button type="button" className="font-semibold text-brand-700 hover:underline" onClick={() => { open(c); setTab('subs') }}>
                        {live}
                        {live !== subs.length && <span className="muted font-normal"> / {subs.length}</span>}
                      </button>
                    </td>
                    <td className="muted px-5 py-3">{c.team}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                        <IconWhatsApp className="h-4 w-4 text-[#25D366]" />
                        {prettyPhone(resolveWhatsappNumber(c, settings))}
                        {!c.whatsapp && <span className="muted text-[11px]">(default)</span>}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="flex items-center gap-2">
                        <Toggle checked={c.active} onChange={() => categoryApi.toggle(c.id)} label={`Toggle ${c.name}`} />
                        <span className={c.active ? 'badge-active' : 'badge-inactive'}>{c.active ? 'Active' : 'Hidden'}</span>
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <OrderButtons onUp={() => categoryApi.move(c.id, 'up')} onDown={() => categoryApi.move(c.id, 'down')} />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        <IconButton tone="brand" title="Edit" onClick={() => open(c)}>
                          <IconEdit className="h-4 w-4" />
                        </IconButton>
                        <a
                          href={`/categories/${c.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          title="View on site"
                          className="grid h-9 w-9 place-items-center rounded-lg border border-black/10 text-ink/55 transition hover:bg-black/5"
                        >
                          <IconExternal className="h-4 w-4" />
                        </a>
                        <IconButton tone="danger" title="Delete" onClick={() => remove(c)}>
                          <IconTrash className="h-4 w-4" />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="muted px-5 py-10 text-center">No categories match.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="border-t border-black/5 bg-amber-50 px-5 py-3 text-xs text-amber-800">
          Toggling a category off hides it from the public website immediately. Order arrows change the order on the Home and
          Categories pages within each group.
        </p>
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} size="lg">
        {editing && (
          <form onSubmit={save}>
            <div className="border-b border-black/5 p-6 pr-16">
              <div className="flex items-center gap-3">
                <IconTile icon={editing.icon} color={editing.color} image={editing.image} size="sm" />
                <div>
                  <h2 className="text-xl font-bold">{editing.id ? `Edit ${editing.name || 'Category'}` : 'Add Category'}</h2>
                  <p className="muted text-sm">Everything here appears on the public category page and decides where enquiries are routed.</p>
                </div>
              </div>
              <div className="mt-5">
                <Tabs
                  value={tab}
                  onChange={setTab}
                  tabs={[
                    { id: 'basics', label: 'Basics & routing' },
                    { id: 'content', label: 'Page content' },
                    { id: 'subs', label: 'Subcategories', count: (editing.subcategories || []).length },
                  ]}
                />
              </div>
            </div>

            {tab === 'basics' && (
              <div className="grid gap-4 p-6 sm:grid-cols-2">
                <Field label="Category Name" required>
                  <input className="field" value={editing.name} onChange={(e) => patch({ name: e.target.value })} />
                </Field>
                <Field label="URL Slug" hint="Leave blank to generate from the name.">
                  <input className="field" value={editing.slug} placeholder={slugify(editing.name)} onChange={(e) => patch({ slug: e.target.value })} />
                </Field>
                <Field label="Group">
                  <select className="field" value={editing.group} onChange={(e) => patch({ group: e.target.value })}>
                    {CATEGORY_GROUPS.map((g) => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Display Order" hint="Lower numbers appear first.">
                  <input className="field" type="number" value={editing.order} onChange={(e) => patch({ order: Number(e.target.value) })} />
                </Field>
                <Group label="Icon">
                  <IconPicker value={editing.icon} color={editing.color} onChange={(icon) => patch({ icon })} />
                </Group>
                <Group label="Icon colour">
                  <ColorPicker value={editing.color} onChange={(color) => patch({ color })} />
                </Group>
                <Group label="Category image (optional)" hint="Replaces the icon on cards. PNG/JPG/SVG, resized automatically.">
                  <ImageInput value={editing.image} onChange={(image) => patch({ image })} onError={setError} />
                </Group>
                <Group label="Banner / featured image (optional)" hint="Shown in the category page hero. Landscape works best.">
                  <ImageInput value={editing.banner} onChange={(banner) => patch({ banner })} onError={setError} preview="wide" />
                </Group>
                <Field label="Short Description" hint="Shown on the category card." className="sm:col-span-2">
                  <input className="field" value={editing.short} onChange={(e) => patch({ short: e.target.value })} />
                </Field>

                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 sm:col-span-2">
                  <p className="flex items-center gap-2 text-sm font-bold text-emerald-800">
                    <IconWhatsApp className="h-4 w-4 text-[#25D366]" /> WhatsApp routing
                  </p>
                  <div className="mt-3 grid gap-4 sm:grid-cols-2">
                    <Field label="Assigned Team">
                      <select className="field" value={editing.team} onChange={(e) => patch({ team: e.target.value })}>
                        {TEAMS.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Category WhatsApp Number" hint={`With country code, e.g. 919884500063. Leave empty to use the default ${prettyPhone(settings.defaultWhatsapp)}.`}>
                      <input
                        className="field"
                        inputMode="numeric"
                        placeholder={`${settings.defaultWhatsapp} (default)`}
                        value={editing.whatsapp}
                        onChange={(e) => patch({ whatsapp: e.target.value.replace(/\D/g, '') })}
                      />
                    </Field>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:col-span-2">
                  <Toggle checked={editing.active} onChange={(v) => patch({ active: v })} label="Active" />
                  <span className="text-sm font-medium">Show this category on the public website</span>
                </div>
              </div>
            )}

            {tab === 'content' && (
              <div className="grid gap-4 p-6 sm:grid-cols-2">
                <Field label="Hero headline" hint='Two sentences; the second is highlighted. e.g. "More customers. More bike bookings."' className="sm:col-span-2">
                  <input className="field" value={editing.headline} onChange={(e) => patch({ headline: e.target.value })} />
                </Field>
                <Field label="Hero introduction" className="sm:col-span-2">
                  <textarea className="field min-h-[70px]" value={editing.intro} onChange={(e) => patch({ intro: e.target.value })} />
                </Field>
                <Field label="Detailed description" hint='Shown in "About … marketing".' className="sm:col-span-2">
                  <textarea className="field min-h-[110px]" value={editing.overview} onChange={(e) => patch({ overview: e.target.value })} />
                </Field>

                <Field label='“How we help” subtitle' className="sm:col-span-2">
                  <input className="field" value={editing.supportSub || ''} onChange={(e) => patch({ supportSub: e.target.value })} />
                </Field>
                <Field label='“Built for … businesses” text' className="sm:col-span-2">
                  <textarea className="field min-h-[60px]" value={editing.builtFor || ''} onChange={(e) => patch({ builtFor: e.target.value })} />
                </Field>

                <Group label="Hero highlights (3)" className="sm:col-span-2">
                  <div className="grid gap-3 sm:grid-cols-3">
                    {(editing.highlights || []).map((h, i) => (
                      <div key={i} className="space-y-2 rounded-xl bg-black/[.02] p-3">
                        <input className="field py-2" placeholder="Title" value={h.title} onChange={(e) => patch({ highlights: editing.highlights.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)) })} />
                        <input className="field py-2" placeholder="Text" value={h.text} onChange={(e) => patch({ highlights: editing.highlights.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)) })} />
                      </div>
                    ))}
                  </div>
                </Group>

                <Field label="Rental types label" hint='Used in "Choose your …" — e.g. "bike types".'>
                  <input className="field" value={editing.typeLabel} onChange={(e) => patch({ typeLabel: e.target.value })} />
                </Field>
                <Field label="Item noun" hint='e.g. "bike" → "get your bikes in front of…"'>
                  <input className="field" value={editing.noun} onChange={(e) => patch({ noun: e.target.value })} />
                </Field>
                <Field label="Inventory field label" hint="Enquiry form, e.g. Fleet size.">
                  <input className="field" value={editing.inventoryLabel} onChange={(e) => patch({ inventoryLabel: e.target.value })} />
                </Field>
                <Field label="Inventory placeholder">
                  <input className="field" value={editing.inventoryPlaceholder} onChange={(e) => patch({ inventoryPlaceholder: e.target.value })} />
                </Field>

                <Group label='Key features ("How we help you win more bookings")' className="sm:col-span-2">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {(editing.features || FEATURE_DEFAULTS).map((f, i) => (
                      <div key={i} className="space-y-2 rounded-xl bg-black/[.02] p-3">
                        <input
                          className="field py-2 font-semibold"
                          value={f.title}
                          onChange={(e) => patch({ features: (editing.features || FEATURE_DEFAULTS).map((x, j) => (j === i ? { ...x, title: e.target.value } : x)) })}
                        />
                        <textarea
                          className="field min-h-[56px] py-2"
                          value={f.text}
                          onChange={(e) => patch({ features: (editing.features || FEATURE_DEFAULTS).map((x, j) => (j === i ? { ...x, text: e.target.value } : x)) })}
                        />
                      </div>
                    ))}
                  </div>
                </Group>

                <Group label="Promotion channels">
                  <ListEditor items={editing.channels} onChange={(channels) => patch({ channels })} placeholder="Add channel" />
                </Group>
                <Group label="Built-for points">
                  <ListEditor items={editing.benefits} onChange={(benefits) => patch({ benefits })} placeholder="Add benefit" />
                </Group>
                <Group label="Your role">
                  <ListEditor items={editing.role} onChange={(role) => patch({ role })} placeholder="Add responsibility" />
                </Group>
                <Group label="Measure (results)">
                  <ListEditor items={editing.outcomes} onChange={(outcomes) => patch({ outcomes })} placeholder="Add outcome" />
                </Group>
              </div>
            )}

            {tab === 'subs' && <SubcategoryEditor category={editing} onChange={(subcategories) => patch({ subcategories })} />}

            {error && <p className="mx-6 mb-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

            <div className="flex justify-end gap-3 border-t border-black/5 p-6">
              <button type="button" className="btn-ghost" onClick={() => setEditing(null)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {editing.id ? 'Save Changes' : 'Add Category'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  )
}

function SubcategoryEditor({ category, onChange }) {
  const subs = category.subcategories || []
  const [openId, setOpenId] = useState(null)
  const update = (id, p) => onChange(subs.map((s) => (s.id === id ? { ...s, ...p } : s)))
  const move = (i, d) => {
    const j = i + d
    if (j < 0 || j >= subs.length) return
    const next = [...subs]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }
  const add = () => {
    const s = { id: uid('sub'), name: '', sample: '', icon: category.icon || 'box', color: 'violet', image: '', active: true }
    onChange([...subs, s])
    setOpenId(s.id)
  }

  return (
    <div className="p-6">
      <p className="muted text-sm">
        These appear as the selectable rental types on the {category.name || 'category'} page and in enquiry messages. Hidden ones
        stay saved but are not shown.
      </p>
      <div className="mt-4 space-y-2">
        {subs.map((s, i) => (
          <div key={s.id} className={`rounded-xl border ${s.active === false ? 'border-dashed border-black/15 bg-black/[.02]' : 'border-black/10'}`}>
            <div className="flex flex-wrap items-center gap-2 p-2.5 sm:flex-nowrap">
              <IconTile icon={s.icon} color={s.color} image={s.image} size="xs" />
              <input
                className="field min-w-0 flex-1 py-2 font-semibold"
                placeholder="Subcategory name"
                value={s.name}
                onChange={(e) => update(s.id, { name: e.target.value })}
              />
              <div className="flex items-center gap-1.5">
                <Toggle checked={s.active !== false} onChange={(v) => update(s.id, { active: v })} label={`Show ${s.name}`} />
                <OrderButtons onUp={() => move(i, -1)} onDown={() => move(i, 1)} />
                <IconButton tone="brand" title="Edit icon & details" onClick={() => setOpenId(openId === s.id ? null : s.id)}>
                  <IconEdit className="h-4 w-4" />
                </IconButton>
                <IconButton tone="danger" title="Delete" onClick={() => window.confirm(`Delete "${s.name || 'this subcategory'}"?`) && onChange(subs.filter((x) => x.id !== s.id))}>
                  <IconTrash className="h-4 w-4" />
                </IconButton>
              </div>
            </div>
            {openId === s.id && (
              <div className="grid gap-4 border-t border-black/5 p-3 sm:grid-cols-2">
                <Field label="Sample listing / description" className="sm:col-span-2">
                  <input className="field" value={s.sample || ''} onChange={(e) => update(s.id, { sample: e.target.value })} />
                </Field>
                <Group label="Icon">
                  <IconPicker value={s.icon} color={s.color} onChange={(icon) => update(s.id, { icon })} />
                </Group>
                <Group label="Colour">
                  <ColorPicker value={s.color} onChange={(color) => update(s.id, { color })} />
                </Group>
                <Group label="Image (optional)" hint="Replaces the icon." className="sm:col-span-2">
                  <ImageInput value={s.image} onChange={(image) => update(s.id, { image })} />
                </Group>
              </div>
            )}
          </div>
        ))}
        {subs.length === 0 && <p className="muted rounded-xl bg-black/[.02] p-6 text-center text-sm">No subcategories yet.</p>}
      </div>
      <button type="button" className="btn-outline btn-sm mt-4" onClick={add}>
        <IconPlus className="h-4 w-4" /> Add subcategory
      </button>
    </div>
  )
}
