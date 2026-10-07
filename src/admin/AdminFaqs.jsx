import { useState } from 'react'
import { AdminPageHeader } from './AdminLayout'
import Modal from '../components/Modal'
import { ColorPicker, Field, Group, IconButton, IconPicker, OrderButtons, Toggle } from './ui'
import { IconTile } from '../components/AppIcon'
import { useData } from '../context/DataContext'
import { FAQ_GROUPS } from '../data/seed'
import { IconEdit, IconPlus, IconTrash } from '../components/Icons'

const BLANK = { question: '', answer: '', icon: 'message', color: 'violet', group: FAQ_GROUPS[0].id, active: true, order: 99 }

export default function AdminFaqs() {
  const { faqs, faqApi, activeFaqs } = useData()
  const [editing, setEditing] = useState(null)

  const save = (e) => {
    e.preventDefault()
    if (!editing.question.trim()) return
    if (editing.id) faqApi.update(editing.id, editing)
    else faqApi.add(editing)
    setEditing(null)
  }

  return (
    <>
      <AdminPageHeader
        title="Frequently Asked Questions"
        subtitle={`${activeFaqs.length} of ${faqs.length} FAQs are shown on the website. The first 8 appear on the Home page; all appear on the Plans page, grouped.`}
      >
        <button type="button" className="btn-primary btn-sm" onClick={() => setEditing({ ...BLANK, order: faqs.length + 1 })}>
          <IconPlus className="h-4 w-4" /> Add FAQ
        </button>
      </AdminPageHeader>

      <div className="space-y-3">
        {faqs.map((f) => (
          <div key={f.id} className="card flex flex-col gap-4 p-5 lg:flex-row lg:items-start">
            <IconTile icon={f.icon} color={f.color} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="font-bold">{f.question}</p>
              <p className="muted mt-1.5 text-sm leading-relaxed">{f.answer}</p>
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide text-brand-700">
                {FAQ_GROUPS.find((g) => g.id === f.group)?.name || 'Plans & Getting Started'}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-3">
              <span className="flex items-center gap-2">
                <Toggle checked={f.active} onChange={() => faqApi.toggle(f.id)} label={`Toggle FAQ ${f.question}`} />
                <span className={f.active ? 'badge-active' : 'badge-inactive'}>{f.active ? 'Active' : 'Hidden'}</span>
              </span>
              <OrderButtons onUp={() => faqApi.move(f.id, 'up')} onDown={() => faqApi.move(f.id, 'down')} />
              <IconButton tone="brand" title="Edit" onClick={() => setEditing({ ...BLANK, ...f })}>
                <IconEdit className="h-4 w-4" />
              </IconButton>
              <IconButton tone="danger" title="Delete" onClick={() => window.confirm('Delete this FAQ?') && faqApi.remove(f.id)}>
                <IconTrash className="h-4 w-4" />
              </IconButton>
            </div>
          </div>
        ))}
        {faqs.length === 0 && <p className="muted card p-8 text-center">No FAQs yet. Add your first question.</p>}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)}>
        {editing && (
          <form onSubmit={save}>
            <div className="border-b border-black/5 p-6">
              <h2 className="text-xl font-bold">{editing.id ? 'Edit FAQ' : 'Add FAQ'}</h2>
              <p className="muted mt-1 text-sm">Only active FAQs are displayed on the user website.</p>
            </div>
            <div className="grid gap-4 p-6 sm:grid-cols-2">
              <Field label="Question" required className="sm:col-span-2">
                <input className="field" value={editing.question} onChange={(e) => setEditing((f) => ({ ...f, question: e.target.value }))} />
              </Field>
              <Field label="Answer" required className="sm:col-span-2">
                <textarea className="field min-h-[120px]" value={editing.answer} onChange={(e) => setEditing((f) => ({ ...f, answer: e.target.value }))} />
              </Field>
              <Group label="Icon">
                <IconPicker value={editing.icon} color={editing.color} onChange={(icon) => setEditing((f) => ({ ...f, icon }))} />
              </Group>
              <Group label="Icon colour">
                <ColorPicker value={editing.color} onChange={(color) => setEditing((f) => ({ ...f, color }))} />
              </Group>
              <Field label="Group">
                <select className="field" value={editing.group} onChange={(e) => setEditing((f) => ({ ...f, group: e.target.value }))}>
                  {FAQ_GROUPS.map((g) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </Field>
              <Field label="Display Order">
                <input className="field" type="number" value={editing.order} onChange={(e) => setEditing((f) => ({ ...f, order: Number(e.target.value) }))} />
              </Field>
              <div className="flex items-center gap-3 sm:col-span-2">
                <Toggle checked={editing.active} onChange={(v) => setEditing((f) => ({ ...f, active: v }))} label="Active" />
                <span className="text-sm font-medium">Show this FAQ on the website</span>
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-black/5 p-6">
              <button type="button" className="btn-ghost" onClick={() => setEditing(null)}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                {editing.id ? 'Save Changes' : 'Add FAQ'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </>
  )
}
