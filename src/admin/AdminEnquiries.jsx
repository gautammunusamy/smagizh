import { Fragment, useMemo, useState } from 'react'
import { AdminPageHeader } from './AdminLayout'
import { IconButton } from './ui'
import { useData } from '../context/DataContext'
import { ENQUIRY_STATUSES } from '../data/seed'
import { formatDate, formatTime, prettyPhone } from '../utils/format'
import { resolveWhatsappNumber, whatsappLink } from '../utils/whatsapp'
import { IconPin, IconSearch, IconTrash, IconWhatsApp } from '../components/Icons'
import AppIcon from '../components/AppIcon'

const STATUS_STYLE = {
  New: 'bg-blue-50 text-blue-700',
  Contacted: 'bg-amber-50 text-amber-700',
  Interested: 'bg-brand-50 text-brand-700',
  'Follow-Up Required': 'bg-orange-50 text-orange-700',
  'Service Confirmed': 'bg-emerald-50 text-emerald-700',
  Closed: 'bg-black/5 text-ink/60',
}

export default function AdminEnquiries() {
  const { enquiries, updateEnquiry, removeEnquiry, categories, plans, settings } = useData()
  const [filters, setFilters] = useState({ category: 'All', status: 'All', plan: 'All', q: '' })
  const [openRow, setOpenRow] = useState(null)

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase()
    return enquiries.filter((e) => {
      if (filters.category !== 'All' && e.categoryId !== filters.category) return false
      if (filters.status !== 'All' && e.status !== filters.status) return false
      if (filters.plan !== 'All' && e.plan !== filters.plan) return false
      if (q && ![e.owner, e.business, e.mobile, e.email].some((v) => String(v || '').toLowerCase().includes(q)))
        return false
      return true
    })
  }, [enquiries, filters])

  const exportCsv = () => {
    const head = ['ID', 'Owner', 'Business', 'Mobile', 'Email', 'Category', 'Rental types', 'Location', 'Plan', 'Service', 'Budget', 'Goal', 'Source', 'Routed to', 'Status', 'Date']
    const rows = filtered.map((e) => [
      e.id,
      e.owner,
      e.business,
      e.mobile,
      e.email,
      categories.find((c) => c.id === e.categoryId)?.name || '',
      (e.subcategories || []).join('; '),
      [e.city, e.state].filter(Boolean).join(' '),
      e.plan,
      e.service,
      e.budget,
      e.goal,
      e.source,
      e.routedTo,
      e.status,
      formatDate(e.createdAt),
    ])
    const csv = [head, ...rows].map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    const a = document.createElement('a')
    a.href = url
    a.download = `smagizh-enquiries-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <AdminPageHeader title="Enquiries" subtitle="All business requirements submitted through the public site.">
        <button type="button" className="btn-outline btn-sm" onClick={exportCsv}>
          <AppIcon name="file" className="h-4 w-4" /> Export CSV
        </button>
      </AdminPageHeader>

      <div className="card mb-5 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-5">
        <select className="field" value={filters.category} onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}>
          <option value="All">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select className="field" value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}>
          <option value="All">All Status</option>
          {ENQUIRY_STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select className="field" value={filters.plan} onChange={(e) => setFilters((f) => ({ ...f, plan: e.target.value }))}>
          <option value="All">All Plans</option>
          {plans.map((p) => (
            <option key={p.id}>{p.name}</option>
          ))}
        </select>
        <div className="relative lg:col-span-2">
          <IconSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
          <input
            className="field pl-10"
            placeholder="Search owner, business or mobile…"
            value={filters.q}
            onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
          />
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="scroll-thin overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead>
              <tr className="border-b border-black/5 bg-black/[.02]">
                <th className="table-head px-5 py-3 text-left">Owner</th>
                <th className="table-head px-5 py-3 text-left">Mobile</th>
                <th className="table-head px-5 py-3 text-left">Category</th>
                <th className="table-head px-5 py-3 text-left">Location</th>
                <th className="table-head px-5 py-3 text-left">Plan</th>
                <th className="table-head px-5 py-3 text-left">Status</th>
                <th className="table-head px-5 py-3 text-left">Date</th>
                <th className="table-head px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => {
                const cat = categories.find((c) => c.id === e.categoryId)
                const number = e.routedTo || resolveWhatsappNumber(cat, settings)
                const isOpen = openRow === e.id
                return (
                  <Fragment key={e.id}>
                    <tr
                      className="cursor-pointer border-b border-black/5 hover:bg-black/[.015]"
                      onClick={() => setOpenRow(isOpen ? null : e.id)}
                    >
                      <td className="px-5 py-3">
                        <p className="font-semibold">{e.owner}</p>
                        <p className="muted text-xs">{e.business}</p>
                      </td>
                      <td className="px-5 py-3">
                        <span className="flex items-center gap-2">
                          {e.mobile}
                          <a
                            href={whatsappLink(number, `Hello ${e.owner}, thank you for your enquiry with ${settings.name}.`)}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(ev) => ev.stopPropagation()}
                            className="text-[#25D366]"
                            title="Reply on WhatsApp"
                          >
                            <IconWhatsApp className="h-4 w-4" />
                          </a>
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="pill bg-brand-50 text-brand-700">
                          {cat && <AppIcon name={cat.icon} className="h-3.5 w-3.5" />}
                          {cat?.name || '—'}
                        </span>
                      </td>
                      <td className="muted px-5 py-3">
                        <span className="inline-flex items-center gap-1.5">
                          <IconPin className="h-3.5 w-3.5 shrink-0 text-magenta-400" />
                          {[e.city, e.state].filter(Boolean).join(', ') || '—'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="pill bg-black/5 text-ink/70">{e.plan || '—'}</span>
                      </td>
                      <td className="px-5 py-3" onClick={(ev) => ev.stopPropagation()}>
                        <select
                          className={`rounded-full border-0 px-3 py-1 text-xs font-semibold ${STATUS_STYLE[e.status] || 'bg-black/5'}`}
                          value={e.status}
                          onChange={(ev) => updateEnquiry(e.id, { status: ev.target.value })}
                        >
                          {ENQUIRY_STATUSES.map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="muted px-5 py-3 text-xs">
                        {formatDate(e.createdAt)}
                        <span className="block">{formatTime(e.createdAt)}</span>
                      </td>
                      <td className="px-5 py-3" onClick={(ev) => ev.stopPropagation()}>
                        <div className="flex justify-end">
                          <IconButton
                            tone="danger"
                            title="Delete enquiry"
                            onClick={() => window.confirm('Delete this enquiry?') && removeEnquiry(e.id)}
                          >
                            <IconTrash className="h-4 w-4" />
                          </IconButton>
                        </div>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr className="border-b border-black/5 bg-brand-50/40">
                        <td colSpan={8} className="px-5 py-5">
                          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            <Detail title="Enquiry Details">
                              <Row k="Enquiry ID" v={e.id} />
                              <Row k="Source" v={e.source || 'Website'} />
                              <Row k="Rental types" v={(e.subcategories || []).join(', ') || '—'} />
                              <Row k="Message" v={e.message || '—'} />
                            </Detail>
                            <Detail title="Customer Details">
                              <Row k="Email" v={e.email || '—'} />
                              <Row k="WhatsApp" v={e.whatsapp || e.mobile} />
                              <Row k="District" v={e.district || '—'} />
                            </Detail>
                            <Detail title="Plan Preference">
                              <Row k="Preferred Plan" v={e.plan || '—'} />
                              <Row k="Required Service" v={e.service || '—'} />
                              <Row k="Budget" v={e.budget || '—'} />
                              <Row k="Primary goal" v={e.goal || '—'} />
                              <Row k="Inventory" v={e.inventory || '—'} />
                            </Detail>
                            <Detail title="Routing">
                              <Row k="Assigned Team" v={e.routedTeam || cat?.team || 'Default'} />
                              <Row k="WhatsApp" v={prettyPhone(number)} />
                              <Row k="Assigned To" v={e.assignedTo || 'Unassigned'} />
                            </Detail>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="muted px-5 py-10 text-center">
                    No enquiries match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="border-t border-black/5 bg-black/[.02] px-5 py-3 text-xs text-ink/55">
          Showing {filtered.length} of {enquiries.length} enquiries — click a row to see the full enquiry.
        </p>
      </div>
    </>
  )
}

const Detail = ({ title, children }) => (
  <div>
    <p className="text-xs font-bold uppercase tracking-wider text-ink/45">{title}</p>
    <dl className="mt-3 space-y-2">{children}</dl>
  </div>
)

const Row = ({ k, v }) => (
  <div className="flex gap-3 text-sm">
    <dt className="w-32 shrink-0 text-ink/50">{k}</dt>
    <dd className="min-w-0 flex-1 break-words font-medium">{v}</dd>
  </div>
)
