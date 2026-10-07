import SectionHeading from './SectionHeading'
import { IconTile, colorOf } from './AppIcon'
import { CtaStrip } from './Sections'
import { useData } from '../context/DataContext'

const ROLE_STYLE = {
  You: 'bg-brand-50 text-brand-700',
  Together: 'bg-emerald-50 text-emerald-700',
  'Smagizh + You': 'bg-fuchsia-50 text-fuchsia-700',
}

export default function HowItWorksSteps({ withHeading = true, withCta = true }) {
  const { activeCategories } = useData()
  const steps = [
    { icon: 'apps', color: 'violet', role: 'You', title: 'Choose Your Rental Category', text: `Select from ${activeCategories.length} rental categories and choose the subcategories your business offers.` },
    { icon: 'list', color: 'blue', role: 'You', title: 'Select a Service or Plan', text: 'Choose individual services or a monthly or annual plan that fits your goals.' },
    { icon: 'file', color: 'rose', role: 'You', title: 'Share Your Business Details', text: 'Tell us your location, inventory, rental prices, availability and customer goals.' },
    { icon: 'message', color: 'teal', role: 'Together', title: 'Review Your Promotion Strategy', text: 'Discuss your audience, service area, campaign channels and follow-up process with our team.' },
    { icon: 'clipboard', color: 'violet', role: 'Together', title: 'Confirm Scope and Costs', text: 'Approve the deliverables, service fee, ad budget, billing cycle and agreed terms.' },
    { icon: 'pointer', color: 'orange', role: 'Together', title: 'Prepare Accounts and Creative', text: 'Provide account access and business assets. Review the ads and fund your ad account directly.' },
    { icon: 'rocket', color: 'pink', role: 'Smagizh + You', title: 'Approve and Launch', text: 'We configure campaigns and enquiry tracking, then launch after your approval and platform review.' },
    { icon: 'chart', color: 'emerald', role: 'Together', title: 'Follow Up and Improve', text: 'Your team responds to enquiries and records bookings. We review performance and refine campaigns.' },
  ]
  const assurances = [
    { icon: 'users', color: 'violet', title: 'Clear responsibilities', text: 'Know who does what at every stage.' },
    { icon: 'database', color: 'blue', title: 'Separate service fee and ad spend', text: 'Costs are agreed before launch.' },
    { icon: 'chart', color: 'pink', title: 'Measure business outcomes', text: 'Review enquiries, bookings and campaign spend.' },
  ]

  return (
    <section id="how-it-works" className="container-x section scroll-mt-24">
      {withHeading && (
        <SectionHeading
          eyebrow="How it works"
          title="Your rental business"
          highlight="growth journey"
          subtitle="A clear process to promote your rentals, manage enquiries and measure booking results."
        />
      )}

      <ol className={`grid gap-5 sm:grid-cols-2 xl:grid-cols-4 ${withHeading ? 'mt-10' : ''}`}>
        {steps.map((s, i) => {
          const c = colorOf(s.color)
          return (
            <li key={s.title} className="card flex h-full flex-col p-6">
              <div className="flex items-start justify-between gap-3">
                <span className={`grid h-11 w-11 place-items-center rounded-xl text-base font-extrabold ${c.tile} ${c.text}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <IconTile icon={s.icon} color={s.color} />
              </div>
              <h3 className="mt-5 text-lg font-bold leading-snug">{s.title}</h3>
              <p className="muted mt-2 flex-1 text-sm leading-relaxed">{s.text}</p>
              <span className={`pill mt-5 w-fit uppercase tracking-wide ${ROLE_STYLE[s.role]}`}>{s.role}</span>
            </li>
          )
        })}
      </ol>

      <div className="card mt-5 grid gap-5 p-6 md:grid-cols-3 md:divide-x md:divide-black/5">
        {assurances.map((a) => (
          <div key={a.title} className="flex items-center gap-4 md:px-4 md:first:pl-0">
            <IconTile icon={a.icon} color={a.color} shape="circle" />
            <div>
              <p className="font-bold">{a.title}</p>
              <p className="muted text-sm">{a.text}</p>
            </div>
          </div>
        ))}
      </div>

      {withCta && (
        <CtaStrip
          className="mt-5"
          title="Ready to promote your rental business?"
          text="Choose your category or speak with our team."
          primary="Get Started"
          primaryTo="/categories"
          icon="rocket"
          note="Timelines depend on account access, approvals and campaign readiness."
        />
      )}
    </section>
  )
}
