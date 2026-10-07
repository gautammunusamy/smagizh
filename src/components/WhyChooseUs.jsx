import SectionHeading from './SectionHeading'
import { IconTile } from './AppIcon'
import { IconCheck } from './Icons'
import { CtaStrip } from './Sections'
import { useData } from '../context/DataContext'

const PILLARS = [
  {
    icon: 'megaphone', color: 'violet', title: 'Promotion for Your Category',
    text: 'Campaigns shaped around what you rent, where you operate and who needs it.',
    points: ['Category and local audience research', 'Relevant keywords and ad creative', 'Seasonal offers and availability', 'Location-focused promotion'],
  },
  {
    icon: 'search', color: 'blue', title: 'Get Discovered Locally',
    text: 'Help nearby customers find your rental business when they need it.',
    points: ['Google Search and Meta campaigns', 'Google Business Profile support', 'Category and location content', 'Clear rental offers and enquiries'],
  },
  {
    icon: 'whatsapp', color: 'green', title: 'Turn Enquiries into Bookings',
    text: 'Give your team a clear way to receive, follow up and manage customer interest.',
    points: ['WhatsApp enquiry connections', 'Category-based team assignment', 'Lead tracking and follow-up', 'Booking status updates'],
  },
  {
    icon: 'chart', color: 'red', title: 'Know What Is Working',
    text: 'Review campaign activity and business outcomes to guide your next move.',
    points: ['Service fee and ad spend breakdown', 'Enquiries and cost per enquiry', 'Bookings recorded by your team', 'Regular reviews and next steps'],
  },
]

export default function WhyChooseUs() {
  const { activeCategories } = useData()
  const trust = [
    { icon: 'layers', color: 'violet', title: `${activeCategories.length} rental categories`, text: 'Vehicles, equipment, products and property.' },
    { icon: 'file', color: 'blue', title: 'Clear scope and budgets', text: 'Agree the work and costs before launch.' },
    { icon: 'users', color: 'emerald', title: 'Coordinated support', text: 'A clear contact and agreed follow-up process.' },
  ]

  return (
    <section id="why-us" className="container-x section scroll-mt-24">
      <SectionHeading
        eyebrow="Why choose Smagizh"
        title="Helping rental business owners"
        highlight="grow through promotion"
        subtitle="We promote your rental services, connect you with potential customers and help you turn enquiries into bookings."
      />
      <p className="mt-4 flex items-center justify-center gap-4 text-sm font-medium text-ink/55">
        <span className="h-px w-12 bg-ink/15" />
        Your Business Growth Partner
        <span className="h-px w-12 bg-ink/15" />
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {PILLARS.map((p) => (
          <div key={p.title} className="card flex h-full flex-col p-6">
            <div className="flex items-center gap-4">
              <IconTile icon={p.icon} color={p.color} />
              <h3 className="text-lg font-bold leading-snug">{p.title}</h3>
            </div>
            <p className="muted mt-4 text-sm leading-relaxed">{p.text}</p>
            <ul className="mt-4 space-y-2.5 border-t border-black/5 pt-4">
              {p.points.map((pt) => (
                <li key={pt} className="flex items-start gap-2.5 text-sm text-ink/70">
                  <IconCheck className="check" />
                  {pt}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="card mt-5 grid gap-5 p-6 md:grid-cols-3 md:divide-x md:divide-black/5">
        {trust.map((t) => (
          <div key={t.title} className="flex items-center gap-4 md:px-4 md:first:pl-0">
            <IconTile icon={t.icon} color={t.color} />
            <div>
              <p className="font-bold">{t.title}</p>
              <p className="muted text-sm">{t.text}</p>
            </div>
          </div>
        ))}
      </div>

      <CtaStrip
        className="mt-5"
        title="Ready to promote your rental business?"
        text="Tell us your category, location and goals."
        primary="Get My Promotion Plan"
      />
    </section>
  )
}
