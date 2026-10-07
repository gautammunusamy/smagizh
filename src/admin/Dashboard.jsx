import { Link } from 'react-router-dom'
import { AdminPageHeader } from './AdminLayout'
import { useData } from '../context/DataContext'
import { formatDate, prettyPhone } from '../utils/format'
import { resolveWhatsappNumber } from '../utils/whatsapp'
import AppIcon, { IconTile } from '../components/AppIcon'
import {
  IconArrowRight,
  IconBox,
  IconChat,
  IconEyeOff,
  IconGrid,
  IconWhatsApp,
} from '../components/Icons'

const STATUS_STYLE = {
  New: 'bg-blue-50 text-blue-700',
  Contacted: 'bg-amber-50 text-amber-700',
  Interested: 'bg-brand-50 text-brand-700',
  'Follow-Up Required': 'bg-orange-50 text-orange-700',
  'Service Confirmed': 'bg-emerald-50 text-emerald-700',
  Closed: 'bg-black/5 text-ink/60',
}

export default function Dashboard() {
  const { categories, services, plans, enquiries, activeCategories, settings } = useData()
  const subTotal = categories.reduce((n, c) => n + (c.subcategories || []).length, 0)

  const inactive = categories.length - activeCategories.length
  const newCount = enquiries.filter((e) => e.status === 'New').length

  const counts = activeCategories
    .map((c) => ({ ...c, count: enquiries.filter((e) => e.categoryId === c.id).length }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)
  const max = Math.max(1, ...counts.map((c) => c.count))

  const stats = [
    { label: 'Total Categories', value: categories.length, hint: `${activeCategories.length} active · ${subTotal} subcategories`, Icon: IconGrid, tone: 'bg-brand-50 text-brand-600' },
    { label: 'Inactive Categories', value: inactive, hint: 'hidden from site', Icon: IconEyeOff, tone: 'bg-amber-50 text-amber-600' },
    { label: 'Total Services', value: services.length, hint: `${plans.length} plans available`, Icon: IconBox, tone: 'bg-emerald-50 text-emerald-600' },
    { label: 'Total Enquiries', value: enquiries.length, hint: `${newCount} new`, Icon: IconChat, tone: 'bg-blue-50 text-blue-600' },
  ]

  return (
    <>
      <AdminPageHeader title="Dashboard" subtitle="Overview of your rental promotion platform.">
        <Link to="/admin/enquiries" className="btn-primary btn-sm">
          View Enquiries <IconArrowRight className="h-4 w-4" />
        </Link>
      </AdminPageHeader>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card flex items-center gap-4 p-5">
            <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${s.tone}`}>
              <s.Icon />
            </span>
            <div>
              <p className="muted text-sm">{s.label}</p>
              <p className="text-2xl font-extrabold leading-tight">{s.value}</p>
              <p className="text-xs font-medium text-brand-600">{s.hint}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 card p-6">
        <h2 className="flex items-center gap-2 font-bold">
          <AppIcon name="chart" className="h-5 w-5 text-brand-600" /> Category-wise Enquiry Count
        </h2>
        <div className="mt-5 space-y-3">
          {counts.length === 0 && <p className="muted text-sm">No enquiries yet.</p>}
          {counts.map((c) => (
            <div key={c.id} className="flex items-center gap-4">
              <span className="flex w-40 shrink-0 items-center gap-2 text-sm sm:w-64">
                <IconTile icon={c.icon} color={c.color} image={c.image} size="xs" />
                <span className="truncate">{c.name}</span>
              </span>
              <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-black/5">
                <span
                  className="block h-full rounded-full bg-brand-gradient"
                  style={{ width: `${(c.count / max) * 100}%` }}
                />
              </span>
              <span className="w-6 text-right text-sm font-semibold">{c.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-black/5 p-5">
            <h2 className="flex items-center gap-2 font-bold">
              <AppIcon name="clipboard" className="h-5 w-5 text-brand-600" /> Recent Enquiries
            </h2>
            <Link to="/admin/enquiries" className="text-sm font-semibold text-brand-700 hover:underline">
              View all
            </Link>
          </div>
          <div className="scroll-thin overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-black/5">
                  <th className="table-head px-5 py-3 text-left">Owner</th>
                  <th className="table-head px-5 py-3 text-left">Category</th>
                  <th className="table-head px-5 py-3 text-left">Status</th>
                  <th className="table-head px-5 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.slice(0, 5).map((e) => {
                  const cat = categories.find((c) => c.id === e.categoryId)
                  return (
                    <tr key={e.id} className="border-b border-black/5 last:border-0">
                      <td className="px-5 py-3">
                        <p className="font-semibold">{e.owner}</p>
                        <p className="muted text-xs">{e.business}</p>
                      </td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-1.5">
                          {cat && <AppIcon name={cat.icon} className="h-4 w-4 text-brand-600" />}
                          {cat?.name || '—'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`pill ${STATUS_STYLE[e.status] || 'bg-black/5'}`}>{e.status}</span>
                      </td>
                      <td className="muted px-5 py-3 text-xs">{formatDate(e.createdAt)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-black/5 p-5">
            <h2 className="flex items-center gap-2 font-bold">
              <IconWhatsApp className="h-5 w-5 text-[#25D366]" /> WhatsApp Routing Status
            </h2>
            <Link to="/admin/whatsapp-routing" className="text-sm font-semibold text-brand-700 hover:underline">
              Manage Routing
            </Link>
          </div>
          <div className="scroll-thin overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-black/5">
                  <th className="table-head px-5 py-3 text-left">Category</th>
                  <th className="table-head px-5 py-3 text-left">Assigned Team</th>
                  <th className="table-head px-5 py-3 text-left">WhatsApp Number</th>
                  <th className="table-head px-5 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {categories.slice(0, 8).map((c) => (
                  <tr key={c.id} className="border-b border-black/5 last:border-0">
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-2">
                        <IconTile icon={c.icon} color={c.color} image={c.image} size="xs" />
                        {c.name}
                      </span>
                    </td>
                    <td className="muted px-5 py-3">{c.team}</td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1.5">
                        <IconWhatsApp className="h-4 w-4 text-[#25D366]" />
                        {prettyPhone(resolveWhatsappNumber(c, settings))}
                        {!c.whatsapp && <span className="muted text-[11px]">(default)</span>}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={c.active ? 'badge-active' : 'badge-inactive'}>
                        {c.active ? 'Live' : 'Hidden'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
