import { Link } from 'react-router-dom'
import { IconTile, colorOf } from './AppIcon'
import { IconArrowRight, IconCheck } from './Icons'
import { useEnquiry } from '../context/EnquiryContext'

/**
 * Service card (correction reference: "Digital marketing services built for rentals").
 * Icon, name, tag, short description, key points, View Details + Enquire.
 */
export default function ServiceCard({ service, pointLimit = 4 }) {
  const { openEnquiry } = useEnquiry()
  const c = colorOf(service.color)
  return (
    <article className="card card-hover flex h-full flex-col p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <IconTile icon={service.icon} color={service.color} image={service.image} size="md" />
        <div className="min-w-0 flex-1">
          {service.tag && (
            <span className={`pill mb-1.5 max-w-full truncate text-[10px] uppercase tracking-wider ${c.tile} ${c.text}`}>
              {service.tag}
            </span>
          )}
          <h3 className="text-base font-bold leading-snug text-ink sm:text-[17px]">
            <Link to={`/services/${service.slug}`} className="hover:text-brand-700">
              {service.name}
            </Link>
          </h3>
        </div>
      </div>
      <p className="muted mt-3 text-sm leading-relaxed">{service.description}</p>
      <ul className="mt-4 flex-1 space-y-2">
        {(service.points || []).slice(0, pointLimit).map((p) => (
          <li key={p} className="flex items-start gap-2.5 text-sm text-ink/70">
            <IconCheck className="check" />
            {p}
          </li>
        ))}
      </ul>
      <div className="mt-5 flex flex-wrap items-center gap-2.5 border-t border-black/5 pt-4">
        <Link to={`/services/${service.slug}`} className="btn-outline btn-sm">
          View Details <IconArrowRight className="h-4 w-4" />
        </Link>
        <button
          type="button"
          onClick={() => openEnquiry({ service: service.name })}
          className="btn-ghost btn-sm text-brand-700"
        >
          Enquire Now
        </button>
      </div>
    </article>
  )
}
