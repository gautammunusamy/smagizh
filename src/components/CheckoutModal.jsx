import { useEffect, useState } from 'react'
import Modal from './Modal'
import AppIcon, { IconTile } from './AppIcon'
import { api } from '../api/client'
import { useData } from '../context/DataContext'
import { rupeesExact } from '../utils/format'
import { openCheckout } from '../utils/razorpay'
import { buildQuickMessage, whatsappLink } from '../utils/whatsapp'
import { IconArrowRight, IconCheck, IconClose, IconWhatsApp } from './Icons'

/**
 * Plan checkout.
 *
 * 1. the visitor confirms their details
 * 2. the backend creates the Razorpay order (it decides the amount)
 * 3. Razorpay Checkout opens
 * 4. the backend verifies the signature before the plan counts as paid
 */
export default function CheckoutModal({ open, plan, billing = 'monthly', amount = null, onClose }) {
  const { settings } = useData()
  const [form, setForm] = useState({ name: '', email: '', contact: '', business: '' })
  const [errors, setErrors] = useState({})
  const [stage, setStage] = useState('details') // details | paying | verifying | done | failed
  const [message, setMessage] = useState('')
  const [result, setResult] = useState(null)

  useEffect(() => {
    if (!open) return
    setStage('details')
    setMessage('')
    setErrors({})
    setResult(null)
  }, [open, plan?.id, billing])

  if (!plan) return null

  const months = billing === 'annual' ? 12 : 1
  const total = amount != null ? amount : 0
  const set = (k) => (e) => {
    const v = e.target.value
    setForm((f) => ({ ...f, [k]: v }))
    setErrors((x) => ({ ...x, [k]: undefined }))
  }

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Enter your name.'
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = 'Enter a valid email address.'
    if (!/^\d{10}$/.test(form.contact.replace(/\D/g, ''))) e.contact = 'Enter a 10-digit mobile number.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const pay = async () => {
    if (!validate()) return
    setStage('paying')
    setMessage('')
    let order
    try {
      order = await api.createOrder({
        planId: plan.id,
        billing,
        name: form.name.trim(),
        email: form.email.trim(),
        contact: form.contact.replace(/\D/g, ''),
        business: form.business.trim(),
      })
    } catch (err) {
      setStage('failed')
      setMessage(err.message)
      return
    }

    const markCancelled = (reason, status) => {
      api.cancelPayment({ razorpay_order_id: order.orderId, reason, status }).catch(() => {})
    }

    try {
      await openCheckout(
        {
          order,
          business: settings.name,
          description: `${order.planName} · ${order.months === 12 ? '12 months' : '1 month'}`,
        },
        {
          onSuccess: async (response) => {
            setStage('verifying')
            try {
              const res = await api.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              })
              setResult(res.payment)
              setStage('done')
            } catch (err) {
              setStage('failed')
              setMessage(err.message)
            }
          },
          onDismiss: () => {
            markCancelled('Checkout closed before payment', 'cancelled')
            setStage('details')
            setMessage('Payment window closed. Nothing has been charged.')
          },
          onFailed: (error) => {
            markCancelled(error?.description || 'Payment failed', 'failed')
            setStage('failed')
            setMessage(error?.description || 'The payment did not go through. Nothing has been charged.')
          },
        },
      )
    } catch (err) {
      setStage('failed')
      setMessage(err.message)
    }
  }

  const busy = stage === 'paying' || stage === 'verifying'
  const waHref = whatsappLink(settings.defaultWhatsapp, buildQuickMessage(settings.name))

  return (
    <Modal open={open} onClose={busy ? () => {} : onClose} labelledBy="checkout-title">
      {stage === 'done' && result ? (
        <div className="p-6 text-center sm:p-10">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
            <IconCheck className="h-8 w-8" />
          </span>
          <h2 id="checkout-title" className="h2 mt-5">
            Payment successful
          </h2>
          <p className="muted mx-auto mt-3 max-w-md text-sm">
            {result.planName} is active for {result.months === 12 ? '12 months' : '1 month'}. Our team will contact you on{' '}
            {result.contact} to start your onboarding.
          </p>
          <dl className="mx-auto mt-6 grid max-w-sm gap-2 rounded-2xl bg-black/[.02] p-4 text-left text-sm">
            <Row k="Reference" v={result.id} />
            <Row k="Payment id" v={result.paymentId} />
            <Row k="Amount paid" v={`${rupeesExact(result.amount)} (${result.billing === 'annual' ? '12 months' : '1 month'})`} />
          </dl>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <a href={waHref} target="_blank" rel="noreferrer" className="btn-whatsapp">
              <IconWhatsApp /> Message us on WhatsApp
            </a>
            <button type="button" className="btn-outline" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <IconTile icon={plan.icon} color={plan.color} size="md" />
            <div className="min-w-0 flex-1">
              <h2 id="checkout-title" className="text-xl font-extrabold tracking-tight sm:text-2xl">
                {plan.name}
              </h2>
              <p className="muted text-sm">
                {billing === 'annual' ? '12 months, paid upfront' : 'Billed monthly'} · service fee only
              </p>
            </div>
            {!busy && (
              <button type="button" onClick={onClose} className="rounded-full p-1 text-ink/40 hover:text-ink" aria-label="Close">
                <IconClose className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="mt-5 flex items-end justify-between rounded-2xl bg-brand-50/70 p-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">Amount payable</p>
              <p className="mt-1 text-3xl font-extrabold leading-none">{rupeesExact(total)}</p>
            </div>
            <p className="text-right text-xs text-ink/55">
              {months === 12 ? '12 × monthly fee' : 'One month'}
              <span className="block">Ad spend billed separately</span>
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Field label="Your name" error={errors.name}>
              <input className="field" value={form.name} onChange={set('name')} placeholder="Full name" disabled={busy} />
            </Field>
            <Field label="Business name">
              <input className="field" value={form.business} onChange={set('business')} placeholder="Your business" disabled={busy} />
            </Field>
            <Field label="Email" error={errors.email}>
              <input className="field" type="email" value={form.email} onChange={set('email')} placeholder="you@business.com" disabled={busy} />
            </Field>
            <Field label="Mobile number" error={errors.contact}>
              <input
                className="field"
                inputMode="numeric"
                maxLength={10}
                value={form.contact}
                onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                placeholder="10-digit number"
                disabled={busy}
              />
            </Field>
          </div>

          {message && (
            <p className={`mt-4 rounded-xl px-3 py-2 text-sm ${stage === 'failed' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-800'}`}>
              {message}
            </p>
          )}

          <button type="button" className="btn-primary mt-5 w-full py-3 text-base" onClick={pay} disabled={busy}>
            {stage === 'paying' ? 'Opening secure checkout…' : stage === 'verifying' ? 'Confirming payment…' : `Pay ${rupeesExact(total)}`}
            {!busy && <IconArrowRight className="h-4 w-4" />}
          </button>

          <p className="mt-3 flex items-center justify-center gap-2 text-center text-xs text-ink/50">
            <AppIcon name="shieldcheck" className="h-4 w-4 text-emerald-600" />
            Payment is processed securely by Razorpay. We never see your card details.
          </p>
        </div>
      )}
    </Modal>
  )
}

const Row = ({ k, v }) => (
  <div className="flex justify-between gap-3">
    <dt className="text-ink/55">{k}</dt>
    <dd className="break-all text-right font-semibold">{v}</dd>
  </div>
)

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs font-medium text-red-600">{error}</span>}
    </label>
  )
}
