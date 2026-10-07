import { useEffect, useMemo, useState } from 'react'
import { AdminPageHeader } from './AdminLayout'
import { Tabs } from './ui'
import { IconTile } from '../components/AppIcon'
import { api } from '../api/client'
import { formatDate, formatTime, prettyPhone, rupeesExact } from '../utils/format'
import { IconSearch } from '../components/Icons'

const STATUS_STYLE = {
  paid: 'bg-emerald-50 text-emerald-700',
  created: 'bg-amber-50 text-amber-700',
  cancelled: 'bg-black/5 text-ink/60',
  failed: 'bg-red-50 text-red-600',
}
const STATUS_LABEL = { paid: 'Paid', created: 'Started', cancelled: 'Cancelled', failed: 'Failed' }

export default function AdminPayments() {
  const [state, setState] = useState({ status: 'loading', payments: [], totals: null, enabled: false, error: '' })
  const [filter, setFilter] = useState('all')
  const [q, setQ] = useState('')

  useEffect(() => {
    let alive = true
    api
      .payments()
      .then((res) => alive && setState({ status: 'ready', payments: res.payments || [], totals: res.totals, enabled: res.enabled, error: '' }))
      .catch((e) => alive && setState((s) => ({ ...s, status: 'error', error: e.message })))
    return () => {
      alive = false
    }
  }, [])

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase()
    return state.payments.filter(
      (p) =>
        (filter === 'all' || p.status === filter) &&
        (!term ||
          [p.id, p.name, p.business, p.email, p.contact, p.paymentId, p.planName].some((v) =>
            String(v || '').toLowerCase().includes(term),
          )),
    )
  }, [state.payments, filter, q])

  const counts = (s) => state.payments.filter((p) => p.status === s).length

  return (
    <>
      <AdminPageHeader
        title="Payments"
        subtitle="Plan payments taken through Razorpay. Amounts are calculated and verified on the server."
      />

      {state.status === 'error' && <p className="card p-6 text-sm text-red-600">{state.error}</p>}

      {!state.enabled && state.status === 'ready' && (
        <p className="card mb-5 border-amber-200 bg-amber-50/60 p-5 text-sm text-amber-800">
          Online payment is switched off — add <code className="font-mono">razorpay_key_id</code> and{' '}
          <code className="font-mono">razorpay_key_secret</code> to <code className="font-mono">api/config.php</code> on the
          server to enable it. Until then the Plans buttons open the enquiry form.
        </p>
      )}

      {state.totals && (
        <div className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Stat icon="wallet" color="emerald" label="Paid payments" value={state.totals.paidCount} />
          <Stat icon="chart" color="violet" label="Total collected" value={rupeesExact(state.totals.paidAmount)} />
          <Stat icon="clock" color="amber" label="Started, not paid" value={counts('created')} />
          <Stat icon="bolt" color="red" label="Failed / cancelled" value={counts('failed') + counts('cancelled')} />
        </div>
      )}

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative lg:w-80">
          <IconSearch className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
          <input className="field pl-10" placeholder="Search name, business, payment id" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Tabs
          value={filter}
          onChange={setFilter}
          tabs={[
            { id: 'all', label: 'All', count: state.payments.length },
            { id: 'paid', label: 'Paid', count: counts('paid') },
            { id: 'created', label: 'Started', count: counts('created') },
            { id: 'failed', label: 'Failed', count: counts('failed') },
            { id: 'cancelled', label: 'Cancelled', count: counts('cancelled') },
          ]}
        />
      </div>

      <div className="card overflow-hidden">
        <div className="scroll-thin overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead>
              <tr className="border-b border-black/5 bg-black/[.02]">
                <th className="table-head px-5 py-3 text-left">Customer</th>
                <th className="table-head px-5 py-3 text-left">Plan</th>
                <th className="table-head px-5 py-3 text-left">Amount</th>
                <th className="table-head px-5 py-3 text-left">Status</th>
                <th className="table-head px-5 py-3 text-left">Razorpay payment id</th>
                <th className="table-head px-5 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="border-b border-black/5 last:border-0 hover:bg-black/[.015]">
                  <td className="px-5 py-3">
                    <p className="font-semibold">{p.name || '—'}</p>
                    <p className="muted text-xs">{p.business}</p>
                    <p className="muted text-xs">
                      {p.contact ? prettyPhone(p.contact) : ''} {p.email ? `· ${p.email}` : ''}
                    </p>
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-medium">{p.planName}</p>
                    <p className="muted text-xs">{p.months === 12 ? '12 months (annual)' : '1 month (monthly)'}</p>
                  </td>
                  <td className="px-5 py-3 font-semibold">{rupeesExact(p.amount)}</td>
                  <td className="px-5 py-3">
                    <span className={`pill ${STATUS_STYLE[p.status] || 'bg-black/5'}`}>{STATUS_LABEL[p.status] || p.status}</span>
                    {p.notes && <p className="muted mt-1 max-w-[220px] text-xs">{p.notes}</p>}
                  </td>
                  <td className="px-5 py-3">
                    <p className="font-mono text-xs">{p.paymentId || '—'}</p>
                    <p className="muted font-mono text-[11px]">{p.id}</p>
                  </td>
                  <td className="muted px-5 py-3 text-xs">
                    {formatDate(p.paidAt || p.createdAt)}
                    <span className="block">{formatTime(p.paidAt || p.createdAt)}</span>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="muted px-5 py-10 text-center">
                    {state.status === 'loading' ? 'Loading…' : 'No payments yet.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="border-t border-black/5 bg-black/[.02] px-5 py-3 text-xs text-ink/55">
          Showing {rows.length} of {state.payments.length}. A plan counts as paid only after Razorpay confirms the payment and
          the signature is verified on the server.
        </p>
      </div>
    </>
  )
}

function Stat({ icon, color, label, value }) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <IconTile icon={icon} color={color} />
      <div>
        <p className="muted text-sm">{label}</p>
        <p className="text-2xl font-extrabold leading-tight">{value}</p>
      </div>
    </div>
  )
}
