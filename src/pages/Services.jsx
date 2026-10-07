import SectionHeading from '../components/SectionHeading'
import ServiceCard from '../components/ServiceCard'
import { CtaStrip } from '../components/Sections'
import { IconTile } from '../components/AppIcon'
import { useData } from '../context/DataContext'
import { Link } from 'react-router-dom'

const PROMISES = [
  { icon: 'target', color: 'violet', title: 'Rental-focused strategy' },
  { icon: 'chart', color: 'indigo', title: 'Measurable performance' },
  { icon: 'message', color: 'emerald', title: 'WhatsApp follow-up' },
]

export default function Services() {
  const { activeServices, groupedCategories } = useData()

  return (
    <div className="pb-4">
      <section className="bg-hero-gradient py-12 sm:py-14">
        <div className="container-x grid items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
          <SectionHeading
            as="h1"
            align="left"
            eyebrow="Our services"
            title="Digital marketing services built for"
            highlight="rentals"
            subtitle="Choose individual services or let our team build a plan around your rental business."
          />
          <div className="grid grid-cols-3 gap-3">
            {PROMISES.map((p) => (
              <div key={p.title} className="card flex flex-col gap-3 p-4">
                <IconTile icon={p.icon} color={p.color} size="sm" />
                <p className="text-sm font-bold leading-snug">{p.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-12">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {activeServices.map((s) => (
            <ServiceCard key={s.id} service={s} />
          ))}
        </div>

        <div className="card mt-10 p-6">
          <h2 className="text-lg font-bold">Available for every rental category</h2>
          <p className="muted mt-1 text-sm">Each service is planned around the category you rent in and the areas you serve.</p>
          <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {groupedCategories.map((g) => (
              <div key={g.id}>
                <p className="kicker">{g.name}</p>
                <ul className="mt-2 space-y-1.5">
                  {g.items.map((c) => (
                    <li key={c.id}>
                      <Link to={`/categories/${c.slug}`} className="text-sm text-ink/70 hover:text-brand-700">
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <CtaStrip
          className="mt-8"
          title="Not sure where to start?"
          text="Share your rental category, location and goals."
          primary="Find My Marketing Plan"
          note="Scope, timelines, ad spend and any third-party costs are confirmed before work begins."
        />
      </section>
    </div>
  )
}
