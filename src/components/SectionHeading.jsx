export default function SectionHeading({ eyebrow, title, highlight, subtitle, align = 'center', className = '', as = 'h2' }) {
  const alignment = align === 'center' ? 'text-center items-center mx-auto' : 'text-left items-start'
  const Heading = as
  return (
    <div className={`flex max-w-3xl flex-col gap-4 ${alignment} ${className}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <Heading className="h2">
        {title} {highlight && <span className="grad-text">{highlight}</span>}
      </Heading>
      {subtitle && <p className="muted text-base leading-relaxed">{subtitle}</p>}
    </div>
  )
}
