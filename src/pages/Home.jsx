import { Link } from 'react-router-dom'
import SectionHeading from '../components/SectionHeading'
import ServiceCard from '../components/ServiceCard'
import { PricingCard } from '../components/PlanCard'
import WhyChooseUs from '../components/WhyChooseUs'
import Testimonials from '../components/Testimonials'
import FaqSection from '../components/FaqSection'
import { CtaBanner, CtaStrip, EnquiryFlow, Notice } from '../components/Sections'
import AppIcon, { CategoryArt, IconTile } from '../components/AppIcon'
import { useData } from '../context/DataContext'
import { TRIAL_POINTS } from '../data/seed'
import { useEnquiry } from '../context/EnquiryContext'
import { usePayment } from '../context/PaymentContext'
import { IconArrowRight } from '../components/Icons'

export default function Home() {
  const { settings, activeCategories, groupedCategories, activeServices, activePlans } = useData()
  const { openEnquiry } = useEnquiry()
  const monthlyPct = Number(settings.monthlyDiscount ?? 5)
  const annualPct = Number(settings.annualDiscount ?? 20)
  const trialPoints = settings.trialPoints?.length ? settings.trialPoints : TRIAL_POINTS
  const { canPay, startCheckout } = usePayment()

  const choosePlan = (plan, billing = 'monthly') => {
    if (canPay(plan, billing) && startCheckout(plan, billing)) return
    openEnquiry({ plan: billing === 'annual' ? `${plan.name} (Annual)` : `${plan.name} (Monthly)` })
  }

  const stats = [
    { icon: 'folder', color: 'blue', title: `${activeCategories.length} Rental Categories` },
    { icon: 'target', color: 'red', title: 'Targeted Marketing' },
    { icon: 'whatsapp', color: 'green', title: 'WhatsApp Enquiries' },
  ]

  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden bg-hero-gradient">
        <span className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-magenta-400/10 blur-3xl" />
        <span className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-brand-400/10 blur-3xl" />

        <div className="container-x grid items-center gap-10 py-12 lg:grid-cols-[1fr_1.05fr] lg:gap-12 lg:py-16">
          <div className="animate-fade-up">
            <span className="eyebrow bg-white/80 shadow-sm">
              <AppIcon name="megaphone" className="h-4 w-4 text-amber-500" />
              Digital marketing for rental businesses
            </span>

            <h1 className="h1 mt-6">
              Your Business
              <br />
              <span className="grad-text">Growth Partner</span>
            </h1>

            <p className="muted mt-6 max-w-xl text-lg leading-relaxed">{settings.heroSubtitle}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link to="/categories" className="btn-primary px-7 py-3 text-base">
                Choose Your Category
                <IconArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/plans" className="btn-outline px-7 py-3 text-base">
                Compare Plans
                <IconArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3 sm:gap-4">
              {stats.map((s) => (
                <div key={s.title} className="card flex flex-col items-center p-4 text-center sm:p-5">
                  <IconTile icon={s.icon} color={s.color} shape="circle" size="md" />
                  <p className="mt-3 text-xs font-bold leading-snug sm:text-base">{s.title}</p>
                </div>
              ))}
            </div>
          </div>

          <CategoryPanel groups={groupedCategories} />
        </div>
      </section>

      {/* Categories are reached from the hero panel and the Categories page —
          the home page deliberately does not repeat the category cards. */}

      {/* ---------------- Services ---------------- */}
      <section id="services" className="bg-white py-14 sm:py-20">
        <div className="container-x">
          <SectionHeading
            eyebrow="Our services"
            title="Digital marketing services built for"
            highlight="rentals"
            subtitle="Choose individual services or a coordinated plan for your rental business. For vehicle, equipment, product and property rental businesses."
          />
          {/* Two services here; the rest are on the Services page. */}
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {activeServices.slice(0, 2).map((s) => (
              <ServiceCard key={s.id} service={s} pointLimit={3} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link to="/services" className="btn-outline">
              View all {activeServices.length} services
              <IconArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <CtaStrip
            className="mt-8"
            title="Not sure which services you need?"
            text="Tell us your rental category, location and goals. We will help you choose."
            whatsappLabel="Talk to Our Team"
            note="Service scope and advertising budgets are agreed before work begins."
          />
        </div>
      </section>

      {/* ---------------- Plans ---------------- */}
      {activePlans.length > 0 && (
        <section id="plans" className="bg-white py-14 scroll-mt-24 sm:py-20">
          <div className="container-x">
            <SectionHeading
              eyebrow="Professional plans"
              title="Choose your plan."
              highlight="Save as you grow."
              subtitle="Monthly flexibility or annual savings for your rental business."
            />
            <div className="mx-auto mt-6 flex max-w-2xl flex-col justify-center gap-3 sm:flex-row">
              <span className="card flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium">
                <AppIcon name="calendar" className="h-5 w-5 text-brand-600" /> Monthly billing –{' '}
                <span className="font-bold text-magenta-500">Save {monthlyPct}%</span>
              </span>
              <span className="card flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium">
                <AppIcon name="tag" className="h-5 w-5 text-emerald-600" /> Annual upfront –{' '}
                <span className="font-bold text-magenta-500">Save {annualPct}%</span>
              </span>
            </div>

            <div className={`mt-8 grid gap-x-5 gap-y-3 pt-3 sm:grid-cols-2 ${activePlans.length >= 4 ? 'xl:grid-cols-4' : 'lg:grid-cols-3'}`}>
              {activePlans.map((p) => (
                <PricingCard
                  key={p.id}
                  plan={p}
                  monthlyPct={monthlyPct}
                  annualPct={annualPct}
                  trialPoints={trialPoints}
                  onChoose={choosePlan}
                />
              ))}
            </div>

            <Notice icon="bolt" className="mt-5">
              Discounts apply to service fees only. Ad spend, applicable taxes and third-party charges are separate and paid
              directly to the platforms.
            </Notice>
            <div className="mt-8 text-center">
              <Link to="/plans" className="btn-outline">
                Compare all plans
                <IconArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      <WhyChooseUs />

      <EnquiryFlow />

      <Testimonials />
      <FaqSection />
      <CtaBanner />
    </>
  )
}

/** Hero panel listing every active category by group (reference: "Promote Your Rental Business"). */
function CategoryPanel({ groups }) {
  return (
    <div className="card animate-fade-up p-4 sm:p-6">
      <h2 className="text-center text-xl font-extrabold tracking-tight sm:text-2xl">Promote Your Rental Business</h2>
      <p className="muted mt-1 text-center text-sm">Marketing support for every rental category</p>
      <div className="mt-5 space-y-4">
        {groups.map((g) => (
          <div key={g.id}>
            <p
              className={`rounded-lg px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.14em] ${
                g.id === 'property' ? 'bg-rose-50 text-rose-600' : 'bg-brand-50 text-brand-700'
              }`}
            >
              {g.name}
            </p>
            <div
              className={`mt-3 grid gap-x-2 gap-y-4 ${
                g.items.length === 1 ? 'grid-cols-1' : 'grid-cols-3 min-[420px]:grid-cols-4'
              }`}
            >
              {g.items.map((c) => (
                <Link
                  key={c.id}
                  to={`/categories/${c.slug}`}
                  className="group flex flex-col items-center rounded-xl p-1 text-center transition hover:bg-brand-50/60"
                >
                  <CategoryArt
                    slug={c.slug}
                    icon={c.icon}
                    color={c.color}
                    image={c.image}
                    size={56}
                    className="transition group-hover:scale-105"
                  />
                  <span className="mt-2 text-[11px] font-medium leading-tight text-ink/75 group-hover:text-brand-700 sm:text-xs">
                    {c.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
