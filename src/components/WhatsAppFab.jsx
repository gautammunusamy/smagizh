import { useData } from '../context/DataContext'
import { buildQuickMessage, resolveWhatsappNumber, whatsappLink } from '../utils/whatsapp'
import { IconWhatsApp } from './Icons'

/**
 * Floating WhatsApp button.
 * On a category page it routes to that category's number, on a service page to
 * that service's number, otherwise to the default business number.
 */
export default function WhatsAppFab({ category = null, service = null }) {
  const { settings } = useData()
  const number = resolveWhatsappNumber(category, settings, service)
  const href = whatsappLink(number, buildQuickMessage(settings.name, category?.name, service?.name))

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group fixed bottom-4 right-4 z-40 flex items-center gap-3 sm:bottom-5 sm:right-5"
      aria-label="Chat on WhatsApp"
    >
      <span className="hidden rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink shadow-card lg:block">
        Chat on WhatsApp
      </span>
      <span className="grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_28px_rgba(37,211,102,.45)] transition group-hover:scale-105">
        <IconWhatsApp className="h-7 w-7" />
      </span>
    </a>
  )
}
