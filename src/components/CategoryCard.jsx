import { Link } from 'react-router-dom'
import { CategoryArt } from './AppIcon'
import { IconArrowRight } from './Icons'
import { CATEGORY_GROUPS } from '../data/seed'

const subCount = (c) => (c.subcategories || []).filter((s) => s.active !== false).length

/** Category card (correction reference: "Select your rental business category"). */
export default function CategoryCard({ category }) {
  const n = subCount(category)
  return (
    <Link
      to={`/categories/${category.slug}`}
      className="card card-hover group flex h-full flex-col p-5 sm:p-6"
      aria-label={`${category.name} - explore`}
    >
      <CategoryArt slug={category.slug} icon={category.icon} color={category.color} image={category.image} size={64} />
      <h3 className="mt-4 text-base font-bold leading-snug text-ink">{category.name}</h3>
      <p className="mt-1 text-xs font-medium text-ink/45">
        {n} subcategor{n === 1 ? 'y' : 'ies'}
      </p>
      <p className="muted mt-3 line-clamp-3 flex-1 text-sm leading-relaxed">{category.short}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
        Explore
        <IconArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </span>
    </Link>
  )
}

/** Full-width variant used when a group has a single category (e.g. Property). */
export function CategoryWideCard({ category }) {
  const n = subCount(category)
  return (
    <Link
      to={`/categories/${category.slug}`}
      className="card card-hover group flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6"
      aria-label={`${category.name} - explore`}
    >
      <CategoryArt slug={category.slug} icon={category.icon} color={category.color} image={category.image} size={56} />
      <div className="min-w-0 flex-1">
        <h3 className="text-base font-bold leading-snug text-ink">{category.name}</h3>
        <p className="mt-1 text-xs font-medium text-ink/45">
          {n} subcategor{n === 1 ? 'y' : 'ies'}
        </p>
        <p className="muted mt-1.5 text-sm leading-relaxed">{category.short}</p>
      </div>
      <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-brand-700">
        Explore
        <IconArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </span>
    </Link>
  )
}

/** Categories bucketed by catalog group: "01 · VEHICLE RENTALS" ... */
export function GroupedCategoryGrid({ groups }) {
  return (
    <div className="space-y-10">
      {groups.map((g) => (
        <section key={g.id} aria-labelledby={`grp-${g.id}`}>
          <div className="mb-5 flex items-center gap-4">
            <h3 id={`grp-${g.id}`} className="kicker shrink-0">
              {String(CATEGORY_GROUPS.findIndex((x) => x.id === g.id) + 1).padStart(2, '0')} · {g.name}
            </h3>
            <span className="h-px flex-1 bg-brand-200/70" />
          </div>
          {g.items.length === 1 ? (
            <CategoryWideCard category={g.items[0]} />
          ) : (
            <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-4 sm:gap-5">
              {g.items.map((c) => (
                <CategoryCard key={c.id} category={c} />
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  )
}
