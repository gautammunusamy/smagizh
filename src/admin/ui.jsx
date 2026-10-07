import { useMemo, useState } from 'react'
import { api } from '../api/client'
import { IconDown, IconUp } from '../components/Icons'
import AppIcon, { COLOR_KEYS, ICON_KEYS, IconTile, colorOf, iconLabel } from '../components/AppIcon'

export const Field = ({ label, required, hint, children, className = '' }) => (
  <label className={`block ${className}`}>
    <span className="label">
      {label}
      {required && <span className="text-magenta-500">*</span>}
    </span>
    {children}
    {hint && <span className="mt-1 block text-[11px] text-ink/45">{hint}</span>}
  </label>
)

/** Same as Field but without the implicit <label> (for composite controls). */
export const Group = ({ label, hint, children, className = '' }) => (
  <div className={className}>
    <span className="label">{label}</span>
    {children}
    {hint && <span className="mt-1 block text-[11px] text-ink/45">{hint}</span>}
  </div>
)

export const Toggle = ({ checked, onChange, label }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={() => onChange(!checked)}
    className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? 'bg-brand-600' : 'bg-black/15'}`}
  >
    <span
      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
        checked ? 'left-[22px]' : 'left-0.5'
      }`}
    />
  </button>
)

export const OrderButtons = ({ onUp, onDown }) => (
  <span className="inline-flex overflow-hidden rounded-lg border border-black/10">
    <button type="button" onClick={onUp} className="grid h-8 w-8 place-items-center text-ink/50 hover:bg-black/5" aria-label="Move up">
      <IconUp className="h-4 w-4" />
    </button>
    <button type="button" onClick={onDown} className="grid h-8 w-8 place-items-center border-l border-black/10 text-ink/50 hover:bg-black/5" aria-label="Move down">
      <IconDown className="h-4 w-4" />
    </button>
  </span>
)

export const IconButton = ({ onClick, title, tone = 'default', children }) => {
  const tones = {
    default: 'border-black/10 text-ink/55 hover:bg-black/5',
    brand: 'border-brand-200 text-brand-600 hover:bg-brand-50',
    danger: 'border-red-200 text-red-500 hover:bg-red-50',
  }
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg border transition ${tones[tone]}`}
    >
      {children}
    </button>
  )
}

/** Upload / preview / remove an image. The file is stored in /uploads by the API. */
export function ImageInput({ value, onChange, onError, preview = 'tile' }) {
  const [busy, setBusy] = useState(false)

  const pick = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) return onError?.('Please choose an image file.')
    if (file.size > 4 * 1024 * 1024) return onError?.('Please choose an image under 4 MB.')
    setBusy(true)
    try {
      const res = await api.upload(file)
      onChange(res.url)
      onError?.('')
    } catch (err) {
      onError?.(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {value && (
        <span className={`grid place-items-center overflow-hidden rounded-xl bg-brand-50 ${preview === 'wide' ? 'h-14 w-24' : 'h-12 w-12'}`}>
          <img src={value} alt="" className={preview === 'wide' ? 'h-full w-full object-cover' : 'h-9 w-9 object-contain'} />
        </span>
      )}
      <input
        type="file"
        accept="image/*"
        disabled={busy}
        onChange={(e) => {
          pick(e.target.files?.[0])
          e.target.value = ''
        }}
        className="max-w-full text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-brand-700"
      />
      {busy && <span className="text-xs text-ink/50">Uploading…</span>}
      {value && !busy && (
        <button type="button" className="text-xs font-semibold text-red-500 hover:underline" onClick={() => onChange('')}>
          Remove
        </button>
      )}
    </div>
  )
}

/** Searchable icon grid over the shared icon registry. */
export function IconPicker({ value, onChange, color = 'violet' }) {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const keys = useMemo(() => {
    const s = q.trim().toLowerCase()
    return s ? ICON_KEYS.filter((k) => k.includes(s) || iconLabel(k).toLowerCase().includes(s)) : ICON_KEYS
  }, [q])
  const c = colorOf(color)
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 rounded-xl border border-black/10 bg-white px-2.5 py-2 text-left text-sm transition hover:border-brand-300"
        aria-expanded={open}
      >
        <IconTile icon={value} color={color} size="xs" />
        <span className="flex-1 truncate">{iconLabel(value)}</span>
        <span className="text-xs font-semibold text-brand-700">{open ? 'Close' : 'Change'}</span>
      </button>
      {open && (
        <div className="mt-2 rounded-xl border border-black/10 bg-white p-2 shadow-card">
          <input className="field py-2" placeholder="Search icons…" value={q} onChange={(e) => setQ(e.target.value)} autoFocus />
          <div className="scroll-thin mt-2 grid max-h-56 grid-cols-6 gap-1 overflow-y-auto sm:grid-cols-8">
            {keys.map((k) => (
              <button
                key={k}
                type="button"
                title={iconLabel(k)}
                aria-label={iconLabel(k)}
                onClick={() => {
                  onChange(k)
                  setOpen(false)
                }}
                className={`grid aspect-square place-items-center rounded-lg transition ${
                  k === value ? `${c.tile} ${c.text} ring-2 ring-brand-400` : 'text-ink/65 hover:bg-brand-50 hover:text-brand-700'
                }`}
              >
                <AppIcon name={k} className="h-5 w-5" />
              </button>
            ))}
            {keys.length === 0 && <p className="col-span-full p-3 text-center text-xs text-ink/45">No icons match.</p>}
          </div>
        </div>
      )}
    </div>
  )
}

export function ColorPicker({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {COLOR_KEYS.map((k) => (
        <button
          key={k}
          type="button"
          title={k}
          aria-label={`Colour ${k}`}
          aria-pressed={value === k}
          onClick={() => onChange(k)}
          className={`h-7 w-7 rounded-full ${colorOf(k).dot} ring-offset-2 transition ${value === k ? 'ring-2 ring-ink/70' : 'hover:scale-110'}`}
        />
      ))}
    </div>
  )
}

export function Tabs({ tabs, value, onChange }) {
  return (
    <div className="no-scrollbar flex gap-1 overflow-x-auto rounded-xl bg-black/[.04] p-1">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={`shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition ${
            value === t.id ? 'bg-white text-brand-700 shadow-sm' : 'text-ink/60 hover:text-ink'
          }`}
        >
          {t.label}
          {t.count != null && <span className="ml-1.5 rounded-full bg-brand-50 px-1.5 text-[11px] text-brand-700">{t.count}</span>}
        </button>
      ))}
    </div>
  )
}

export const ListEditor = ({ items = [], onChange, placeholder = 'Add an item' }) => (
  <div className="space-y-2">
    {items.map((item, i) => (
      <div key={i} className="flex gap-2">
        <input
          className="field"
          value={item}
          onChange={(e) => onChange(items.map((x, j) => (j === i ? e.target.value : x)))}
        />
        <button
          type="button"
          onClick={() => onChange(items.filter((_, j) => j !== i))}
          className="shrink-0 rounded-lg border border-red-200 px-3 text-sm text-red-500 hover:bg-red-50"
        >
          Remove
        </button>
      </div>
    ))}
    <button
      type="button"
      onClick={() => onChange([...items, ''])}
      className="text-sm font-semibold text-brand-700 hover:underline"
    >
      + {placeholder}
    </button>
  </div>
)
