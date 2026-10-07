import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import CheckoutModal from '../components/CheckoutModal'
import { api } from '../api/client'

/**
 * Razorpay availability + one checkout dialog for the whole site.
 *
 * The payable amounts are fetched from the backend, which is the only place
 * that decides what a plan costs. When payments are switched off in
 * api/config.php, `enabled` stays false and the Plans buttons keep their
 * original enquiry behaviour.
 */
const PaymentContext = createContext(null)

export function PaymentProvider({ children }) {
  const [enabled, setEnabled] = useState(false)
  const [priced, setPriced] = useState({})
  const [checkout, setCheckout] = useState({ open: false, plan: null, billing: 'monthly', amount: 0 })

  useEffect(() => {
    let alive = true
    api
      .paymentPlans()
      .then((res) => {
        if (!alive) return
        setEnabled(!!res.enabled)
        setPriced(Object.fromEntries((res.plans || []).map((p) => [p.id, p])))
      })
      .catch(() => {
        if (alive) setEnabled(false)
      })
    return () => {
      alive = false
    }
  }, [])

  /** Server-side amount for a plan + billing cycle, or null when not payable. */
  const amountFor = useCallback(
    (planId, billing = 'monthly') => {
      const row = priced[planId]
      if (!row) return null
      return billing === 'annual' ? row.annual?.amount ?? null : row.monthly?.amount ?? null
    },
    [priced],
  )

  const canPay = useCallback((plan, billing = 'monthly') => enabled && !!plan && !plan.free && amountFor(plan.id, billing) != null, [enabled, amountFor])

  const startCheckout = useCallback(
    (plan, billing = 'monthly') => {
      const amount = amountFor(plan?.id, billing)
      if (amount == null) return false
      setCheckout({ open: true, plan, billing, amount })
      return true
    },
    [amountFor],
  )

  const closeCheckout = useCallback(() => setCheckout((c) => ({ ...c, open: false })), [])

  const value = useMemo(
    () => ({ enabled, amountFor, canPay, startCheckout }),
    [enabled, amountFor, canPay, startCheckout],
  )

  return (
    <PaymentContext.Provider value={value}>
      {children}
      <CheckoutModal
        open={checkout.open}
        plan={checkout.plan}
        billing={checkout.billing}
        amount={checkout.amount}
        onClose={closeCheckout}
      />
    </PaymentContext.Provider>
  )
}

export function usePayment() {
  const ctx = useContext(PaymentContext)
  if (!ctx) throw new Error('usePayment must be used inside <PaymentProvider>')
  return ctx
}
