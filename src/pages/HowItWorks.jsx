import SectionHeading from '../components/SectionHeading'
import HowItWorksSteps from '../components/HowItWorksSteps'
import { EnquiryFlow } from '../components/Sections'

export default function HowItWorks() {
  return (
    <div className="pb-4">
      <section className="bg-hero-gradient pb-2 pt-12 sm:pt-14">
        <div className="container-x">
          <SectionHeading
            as="h1"
            eyebrow="How it works"
            title="Your rental business"
            highlight="growth journey"
            subtitle="A clear process to promote your rentals, manage enquiries and measure booking results."
          />
        </div>
      </section>
      <HowItWorksSteps withHeading={false} />
      <EnquiryFlow />
    </div>
  )
}
