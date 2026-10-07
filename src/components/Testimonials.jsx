import SectionHeading from './SectionHeading'
import AppIcon, { IconTile, colorOf } from './AppIcon'
import { IconQuote } from './Icons'
import { CtaStrip } from './Sections'
import { useData } from '../context/DataContext'

export default function Testimonials() {
  const { testimonials, getCategory, activeCategories } = useData()
  const strip = [
    { icon: 'box', color: 'violet', title: `${activeCategories.length} rental categories`, text: 'Vehicles, equipment, products and property' },
    { icon: 'chart', color: 'blue', title: 'Clear campaign reporting', text: 'Review enquiries and advertising spend' },
    { icon: 'users', color: 'pink', title: 'Coordinated support', text: 'An agreed contact and follow-up process' },
    { icon: 'file', color: 'amber', title: 'Transparent service scope', text: 'Confirm deliverables and costs before launch' },
  ]

  return (
    <section className="container-x section">
      <SectionHeading
        eyebrow="Testimonials"
        title="Voices from the"
        highlight="rental business community"
        subtitle="What rental business owners value when they promote with us."
      />

      <div className="no-scrollbar -mx-4 mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
        {testimonials.map((t) => {
          const cat = getCategory(t.categoryId)
          const c = colorOf(cat?.color)
          return (
            <figure key={t.id} className="card flex w-[85%] shrink-0 snap-center flex-col p-6 md:w-auto">
              <div className="flex items-center justify-between gap-3">
                <span className={`grid h-11 w-11 place-items-center rounded-full ${c.tile} ${c.text}`}>
                  <IconQuote className="h-5 w-5" />
                </span>
                {t.sample && (
                  <span className={`pill uppercase tracking-wider ${c.tile} ${c.text}`}>Sample feedback</span>
                )}
              </div>
              <blockquote className="mt-5 flex-1 text-lg font-semibold leading-snug text-ink/90">“{t.quote}”</blockquote>
              <figcaption className="mt-5 flex items-center gap-3 border-t border-black/5 pt-5">
                <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${c.tile} ${c.text}`}>
                  <AppIcon name="user" className="h-5 w-5" />
                </span>
                <span>
                  <span className="block font-bold">{t.role}</span>
                  <span className="muted block text-sm">
                    {t.name ? `${t.name}${t.business ? `, ${t.business}` : ''}` : 'Customer name and business to be added'}
                  </span>
                </span>
              </figcaption>
              {cat && (
                <span className={`mt-4 inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold ${c.tile} ${c.text}`}>
                  <AppIcon name={cat.icon} className="h-5 w-5" /> {cat.name}
                </span>
              )}
            </figure>
          )
        })}
      </div>

      <div className="card mt-6 grid gap-5 p-6 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-black/5">
        {strip.map((s) => (
          <div key={s.title} className="flex items-center gap-4 lg:px-4 lg:first:pl-0">
            <IconTile icon={s.icon} color={s.color} shape="circle" />
            <div>
              <p className={`font-bold ${colorOf(s.color).text}`}>{s.title}</p>
              <p className="muted text-sm leading-snug">{s.text}</p>
            </div>
          </div>
        ))}
      </div>

      <CtaStrip
        className="mt-5"
        icon="megaphone"
        title="Let us understand your rental business"
        text="Share your category, location and promotion goals."
        primary="Discuss My Marketing Plan"
      />
    </section>
  )
}
