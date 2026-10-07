import { Link } from 'react-router-dom'
import SectionHeading from '../components/SectionHeading'
import ConsultationForm from '../components/ConsultationForm'
import { IconTile } from '../components/AppIcon'
import { useData } from '../context/DataContext'
import { buildQuickMessage, whatsappLink } from '../utils/whatsapp'
import { IconMail, IconPhone, IconPin, IconWhatsApp } from '../components/Icons'

const SUPPORT = [
  { icon: 'megaphone', color: 'violet', title: 'Paid advertising', text: 'Google and Meta campaigns focused on your service area.' },
  { icon: 'map-pin', color: 'pink', title: 'Local visibility', text: 'Google Business Profile support and local SEO.' },
  { icon: 'file', color: 'blue', title: 'Campaign content', text: 'Ad creatives and landing pages for your rentals.' },
  { icon: 'whatsapp', color: 'green', title: 'Enquiry routing', text: 'Connect enquiries to your team through WhatsApp, calls or forms.' },
  { icon: 'chart', color: 'orange', title: 'Performance reporting', text: 'Review spend, enquiries and recorded booking outcomes.' },
  { icon: 'settings', color: 'violet', title: 'Practical planning', text: 'Choose a service scope that fits your goals and budget.' },
]

export default function About() {
  const { groupedCategories } = useData()
  return (
    <div className="pb-4">
      <section className="bg-hero-gradient py-12 sm:py-16">
        <div className="container-x">
          <SectionHeading
            as="h1"
            eyebrow="About Smagizh"
            title="Helping rental businesses grow"
            highlight="through focused promotion."
            subtitle="We connect your rental business with people looking for what you offer—across vehicles, equipment, products and property."
          />
          <div className="mx-auto mt-10 grid max-w-5xl gap-5 md:grid-cols-2">
            <div className="card flex items-start gap-5 p-6">
              <IconTile icon="users" color="violet" size="lg" />
              <div>
                <h2 className="text-xl font-bold">Who we are</h2>
                <p className="muted mt-2 text-sm leading-relaxed">
                  Smagizh Marketing is a digital marketing partner for rental business owners. We build campaigns around your
                  category, service area, inventory and business goals.
                </p>
              </div>
            </div>
            <div className="card flex items-start gap-5 p-6">
              <IconTile icon="target" color="pink" size="lg" />
              <div>
                <h2 className="text-xl font-bold">What we do</h2>
                <p className="muted mt-2 text-sm leading-relaxed">
                  We help you get discovered, attract relevant enquiries and improve follow-up through paid advertising, local
                  search, content and WhatsApp enquiry support.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-x section">
        <SectionHeading eyebrow="How we support your growth" title="Practical digital marketing support" highlight="for rental businesses" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SUPPORT.map((s) => (
            <div key={s.title} className="card flex h-full items-start gap-4 p-5">
              <IconTile icon={s.icon} color={s.color} />
              <div>
                <h3 className="text-lg font-bold">{s.title}</h3>
                <p className="muted mt-1 text-sm leading-relaxed">{s.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="card mt-6 p-6 text-center">
          <span className="eyebrow">Built for rental businesses</span>
          <p className="muted mt-3 text-sm">We work with rental businesses across a wide range of categories.</p>
          <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-4 md:divide-x md:divide-black/5">
            {groupedCategories.map((g) => (
              <Link key={g.id} to="/categories" className="group flex flex-col items-center gap-3">
                <IconTile icon={g.icon} color={g.color} size="lg" className="transition group-hover:scale-105" />
                <span className="text-sm font-bold leading-snug">{g.short}</span>
                <span className="text-xs text-ink/45">{g.items.length} categories</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x pb-6">
        <ContactBlock />
      </section>
    </div>
  )
}

/** "Let's talk about your rental business" + consultation form. */
export function ContactBlock() {
  const { settings } = useData()
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="card p-6 sm:p-8">
        <h2 className="text-2xl font-extrabold tracking-tight">Let’s talk about your rental business</h2>
        <p className="muted mt-2">Tell us what you rent, where you operate and what you want to achieve.</p>
        <ul className="mt-6 space-y-4">
          <li className="flex items-center gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600"><IconMail /></span>
            <a href={`mailto:${settings.email}`} className="break-all text-base font-medium hover:text-brand-700 sm:text-lg">{settings.email}</a>
          </li>
          <li className="flex items-center gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-600"><IconPhone /></span>
            <a href={`tel:${String(settings.phone).replace(/\s/g, '')}`} className="text-base font-medium hover:text-brand-700 sm:text-lg">{settings.phone}</a>
          </li>
          <li className="flex items-center gap-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-rose-50 text-rose-500"><IconPin /></span>
            <span className="text-base font-medium sm:text-lg">{settings.address || settings.city}</span>
          </li>
        </ul>
        <a
          href={whatsappLink(settings.defaultWhatsapp, buildQuickMessage(settings.name))}
          target="_blank"
          rel="noreferrer"
          className="btn mt-8 border-2 border-[#25D366] bg-white px-8 py-3 text-base text-[#128C4A] hover:bg-emerald-50"
        >
          <IconWhatsApp className="h-5 w-5 text-[#25D366]" /> Chat on WhatsApp
        </a>
      </div>
      <div className="card p-6 sm:p-8">
        <ConsultationForm source="About page" />
      </div>
    </div>
  )
}
