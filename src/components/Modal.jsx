import { useEffect } from 'react'
import { IconClose } from './Icons'

export default function Modal({ open, onClose, children, size = 'md', labelledBy }) {
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const width = { sm: 'max-w-md', md: 'max-w-2xl', lg: 'max-w-4xl' }[size]

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
      <div className="fixed inset-0 bg-ink/60" onClick={onClose} />
      <div className="relative flex min-h-full items-start justify-center p-3 sm:p-6">
        <div className={`relative w-full ${width} animate-scale-in rounded-3xl bg-white shadow-pop`}>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-black/5 text-ink/60 transition hover:bg-black/10 hover:text-ink"
          >
            <IconClose className="h-4 w-4" />
          </button>
          {children}
        </div>
      </div>
    </div>
  )
}
