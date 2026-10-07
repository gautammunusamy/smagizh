import AppIcon, { IconTile } from './AppIcon'
import { rupees, rupeesExact, discounted } from '../utils/format'
import { IconCheck } from './Icons'

/**
 * Compact plan card on each category page (client mockup "Choose your marketing plan"):
 * icon + name, price for the selected billing, one-liner, 3 points, button.
 */
export default function PlanCard({ plan, billing = 'monthly', monthlyPct = 5, annualPct = 20, onChoose }) {
  const featured = !!plan.recommended
  const annual = billing === 'annual' && !plan.free
  // Show exactly what will be charged, so the card and the checkout agree.
  const pct = plan.free ? 0 : annual ? annualPct : monthlyPct
  const payable = discounted(plan.price, pct)
  const price = plan.free ? rupees(0) : rupeesExact(payable)
  return (
    <div
      className={`relative flex h-full flex-col rounded-2xl border bg-white p-5 ${
        featured ? 'border-brand-500 bg-brand-50/30 shadow-[0_18px_45px_rgba(124,58,237,.16)] ring-1 ring-brand-300' : 'border-black/[.07] shadow-card'
      }`}
    >
      {featured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-600 px-3.5 py-1 text-[11px] font-semibold text-white">
          Recommended
        </span>
      )}
      <div className="flex items-center gap-2.5">
        <IconTile icon={plan.icon} color={plan.color} size="xs" />
        <h3 className="text-base font-bold">{plan.short || plan.name}</h3>
      </div>
      <p className="mt-4 flex items-end gap-1">
        <span className="text-[28px] font-extrabold leading-none tracking-tight">{price}</span>
        <span className="pb-0.5 text-sm text-ink/55">/ month</span>
      </p>
      {pct > 0 && (
        <p className="mt-1 text-[11px] font-semibold text-emerald-600">
          <span className="text-ink/40 line-through">{rupees(plan.price)}</span>{' '}
          {annual ? `Billed annually · Save ${annualPct}%` : `Save ${monthlyPct}% monthly`}
        </p>
      )}
      {plan.categoryNote && <p className="mt-1.5 text-sm text-ink/55">{plan.categoryNote}</p>}
      <ul className="mt-4 flex-1 space-y-2">
        {(plan.features || []).map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-ink/75">
            <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => onChoose?.(plan)}
        className={`btn mt-5 w-full rounded-lg py-2.5 ${featured ? 'bg-brand-600 text-white hover:bg-brand-700' : 'border border-brand-400 bg-white text-brand-700 hover:bg-brand-50'}`}
      >
        {plan.free ? 'Start free' : `Choose ${plan.short || plan.name.replace(/\s*Plan$/i, '')}`}
      </button>
    </div>
  )
}

/**
 * Pricing card for the Plans page (client reference "Choose your plan. Save as you grow.").
 * Rendered inside a grid whose rows the card shares via `subgrid`, so the price
 * boxes, trial box, scope list and buttons line up across all plans.
 * Percentages come from Admin → Plans (monthly / annual discount).
 */
export function PricingCard({ plan, monthlyPct = 5, annualPct = 20, trialPoints = [], onChoose }) {
  const free = !!plan.free
  const Check = ({ tone = 'text-brand-600' }) => <IconCheck className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${tone}`} />
  return (
    <div
      className={`relative mb-6 grid grid-rows-subgrid gap-3 rounded-2xl border bg-white p-5 xl:mb-0 [grid-row:span_5] ${
        free ? 'border-brand-500 shadow-[0_18px_45px_rgba(124,58,237,.14)]' : 'border-black/[.07] shadow-card'
      }`}
    >
      {free && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-brand-600 px-4 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
          Start Free
        </span>
      )}

      {/* 1 · name, description, standard fee */}
      <div>
        <IconTile icon={plan.icon} color={plan.color} size="lg" />
        <h3 className="mt-4 text-lg font-bold">{plan.name}</h3>
        <p className="muted mt-1 text-sm leading-snug">{plan.description}</p>
        <p className="mt-3 text-xs text-ink/60">
          Standard fee:{' '}
          <span className={`font-semibold ${free ? 'text-rose-500 line-through' : 'text-brand-700'}`}>{rupees(plan.price)}</span>
          <span className="text-ink/45"> / month</span>
        </p>
      </div>

      {/* 2 · prices */}
      {free ? (
        <div className="pt-2">
          <p className="text-4xl font-extrabold leading-none">₹0</p>
          <p className="mt-1.5 text-sm text-ink/60">/ month</p>
          <p className="mt-3 text-xs text-ink/50">Billed monthly</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          <PriceBox
            tone="rose"
            label={`${monthlyPct}% off monthly`}
            amount={rupeesExact(discounted(plan.price, monthlyPct))}
            billed="Billed monthly"
          />
          <PriceBox
            tone="emerald"
            label={`${annualPct}% off annually`}
            amount={rupeesExact(discounted(plan.price, annualPct))}
            billed="Billed annually"
          />
        </div>
      )}

      {/* 3 · forever free / free trial */}
      {free ? (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3.5">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
            <AppIcon name="gift" className="h-4 w-4" /> Forever free
          </p>
          <ul className="mt-2 space-y-1.5">
            {(plan.freeFeatures || []).map((f) => (
              <li key={f} className="flex items-start gap-2 text-xs text-ink/75">
                <Check tone="text-emerald-600" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      ) : trialPoints.length > 0 ? (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-3.5">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-emerald-700">
            <AppIcon name="calendar" className="h-4 w-4" /> 30 days free trial
          </p>
          <ul className="mt-2 space-y-1.5">
            {trialPoints.map((t) => (
              <li key={t} className="flex items-start gap-2 text-xs text-ink/75">
                <Check tone="text-emerald-600" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div />
      )}

      {/* 4 · included scope */}
      <div className="border-t border-black/5 pt-3">
        {(plan.scope || []).length > 0 && (
          <>
            <p className="text-xs font-bold text-ink/80">Included service scope:</p>
            <ul className="mt-2 space-y-1.5">
              {plan.scope.map((s) => (
                <li key={s} className="flex items-start gap-2 text-xs text-ink/70">
                  <Check />
                  {s}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* 5 · actions */}
      <div className="space-y-2 self-end pt-2">
        {free ? (
          <>
            <button type="button" className="btn w-full bg-brand-600 py-3 text-white hover:bg-brand-700" onClick={() => onChoose?.(plan, 'free')}>
              Start Free
            </button>
            <button
              type="button"
              className="block w-full py-1.5 text-center text-sm font-semibold text-brand-700 hover:underline"
              onClick={() => onChoose?.(plan, 'annual')}
            >
              Choose Annual – Save {annualPct}%
            </button>
          </>
        ) : (
          <>
            <button type="button" className="btn-outline w-full rounded-lg" onClick={() => onChoose?.(plan, 'monthly')}>
              Choose Monthly
            </button>
            <button type="button" className="btn-primary w-full rounded-lg" onClick={() => onChoose?.(plan, 'annual')}>
              Choose Annual – Save {annualPct}%
            </button>
          </>
        )}
      </div>
    </div>
  )
}

function PriceBox({ tone, label, amount, billed }) {
  const t = {
    rose: 'border-rose-100 bg-rose-50/60 [&_.lbl]:text-rose-500',
    emerald: 'border-emerald-100 bg-emerald-50/60 [&_.lbl]:text-emerald-700',
  }[tone]
  return (
    <div className={`rounded-xl border p-3.5 ${t}`}>
      <p className="lbl text-[11px] font-bold uppercase tracking-wide">{label}</p>
      <p className="mt-1.5 text-xl font-extrabold leading-none tracking-tight">{amount}</p>
      <p className="mt-1 text-xs text-ink/60">/ month</p>
      <p className="mt-1.5 text-[11px] text-ink/45">{billed}</p>
    </div>
  )
}
