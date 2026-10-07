import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SectionHeading from '../components/SectionHeading'
import { GroupedCategoryGrid } from '../components/CategoryCard'
import { CtaStrip } from '../components/Sections'
import AppIcon from '../components/AppIcon'
import { useData } from '../context/DataContext'
import { IconSearch } from '../components/Icons'

export default function Categories() {
  const { activeCategories, groupedCategories } = useData()
  const [query, setQuery] = useState('')
  const [group, setGroup] = useState('all')

  const q = query.trim().toLowerCase()
  const totalSubs = activeCategories.reduce((n, c) => n + (c.subcategories || []).filter((s) => s.active !== false).length, 0)

  const groups = useMemo(
    () =>
      groupedCategories
        .filter((g) => group === 'all' || g.id === group)
        .map((g) => ({
          ...g,
          items: g.items.filter(
            (c) =>
              !q ||
              c.name.toLowerCase().includes(q) ||
              (c.subcategories || []).some((s) => s.active !== false && s.name.toLowerCase().includes(q)),
          ),
        }))
        .filter((g) => g.items.length > 0),
    [groupedCategories, group, q],
  )

  // subcategory hits, so "excavator" points straight at Construction Equipment
  const subHits = useMemo(() => {
    if (q.length < 2) return []
    return activeCategories
      .flatMap((c) =>
        (c.subcategories || [])
          .filter((s) => s.active !== false && s.name.toLowerCase().includes(q))
          .map((s) => ({ ...s, category: c })),
      )
      .slice(0, 8)
  }, [activeCategories, q])

  return (
    <div className="pb-4">
      <section className="bg-hero-gradient py-12 sm:py-14">
        <div className="container-x">
          <SectionHeading
            as="h1"
            eyebrow="Categories"
            title="Select your"
            highlight="rental business category"
            subtitle={`Every category gets its own promotion strategy, plans and a dedicated WhatsApp representative. ${activeCategories.length} categories · ${totalSubs} subcategories.`}
          />

          <div className="mx-auto mt-8 max-w-3xl">
            <div className="relative">
              <IconSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/35" />
              <input
                className="field py-3 pl-11"
                placeholder="Search a category or rental type — e.g. excavator, sarees, projector…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search categories"
              />
            </div>
            <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0">
              {[{ id: 'all', name: 'All categories' }, ...groupedCategories].map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGroup(g.id)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    group === g.id ? 'bg-brand-gradient text-white shadow-sm' : 'bg-white text-ink/70 ring-1 ring-black/10 hover:text-ink'
                  }`}
                >
                  {g.name}
                </button>
              ))}
            </div>

            {subHits.length > 0 && (
              <div className="mt-4 rounded-2xl bg-white/80 p-3 ring-1 ring-black/5">
                <p className="px-1 text-xs font-semibold text-ink/50">Matching rental types</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {subHits.map((s) => (
                    <Link
                      key={s.id}
                      to={`/categories/${s.category.slug}#types`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-800 hover:bg-brand-100"
                    >
                      <AppIcon name={s.icon} className="h-4 w-4" />
                      {s.name}
                      <span className="text-ink/40">· {s.category.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="container-x py-12">
        {groups.length === 0 ? (
          <p className="muted py-16 text-center">No categories match your search. Try a different keyword.</p>
        ) : (
          <GroupedCategoryGrid groups={groups} />
        )}
        <CtaStrip
          className="mt-12"
          title="Can't find your rental category?"
          text="Tell us what you rent and where you operate — we will suggest the right promotion plan."
          primary="Send an Enquiry"
        />
      </div>
    </div>
  )
}
