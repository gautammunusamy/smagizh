export const rupees = (n) =>
  '₹' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })

/** ₹4,749.05 — keeps paise only when the amount has them (discounted fees). */
export const rupeesExact = (n) => {
  const v = Math.round(Number(n || 0) * 100) / 100
  return '₹' + v.toLocaleString('en-IN', { minimumFractionDigits: Number.isInteger(v) ? 0 : 2, maximumFractionDigits: 2 })
}

export const discounted = (price, pct) => (Number(price || 0) * (100 - Number(pct || 0))) / 100

export const prettyPhone = (num) => {
  const d = String(num || '').replace(/\D/g, '')
  if (d.length === 12 && d.startsWith('91')) return `+91 ${d.slice(2, 7)} ${d.slice(7)}`
  if (d.length === 10) return `+91 ${d.slice(0, 5)} ${d.slice(5)}`
  return num ? `+${d}` : ''
}

export const formatDate = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export const formatTime = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

export const slugify = (s) =>
  String(s || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')

export const uid = (prefix = 'id') => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
