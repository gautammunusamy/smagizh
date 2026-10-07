/**
 * Loads Razorpay Checkout once and opens it.
 *
 * Only the public key id ever reaches the browser - the key secret stays on
 * the server, and the order is created there too.
 */

const SRC = 'https://checkout.razorpay.com/v1/checkout.js'
let loader = null

export function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve(window.Razorpay)
  if (loader) return loader
  loader = new Promise((resolve, reject) => {
    const el = document.createElement('script')
    el.src = SRC
    el.async = true
    el.onload = () => (window.Razorpay ? resolve(window.Razorpay) : reject(new Error('Checkout failed to start.')))
    el.onerror = () => {
      loader = null
      reject(new Error('Could not load the payment window. Check your connection and try again.'))
    }
    document.body.appendChild(el)
  })
  return loader
}

/**
 * Opens Checkout for an order created by the backend.
 * `handlers` gets { onSuccess(response), onDismiss(), onFailed(error) }.
 */
export async function openCheckout({ order, business, description, themeColor = '#7C3AED' }, handlers = {}) {
  const Razorpay = await loadRazorpay()
  const rz = new Razorpay({
    key: order.keyId,
    order_id: order.orderId,
    amount: order.amount,
    currency: order.currency || 'INR',
    name: business || 'Smagizh Marketing',
    description: description || order.planName,
    prefill: order.prefill || {},
    notes: { reference: order.reference },
    theme: { color: themeColor },
    retry: { enabled: false },
    modal: { ondismiss: () => handlers.onDismiss?.() },
    handler: (response) => handlers.onSuccess?.(response),
  })
  rz.on('payment.failed', (e) => handlers.onFailed?.(e?.error || {}))
  rz.open()
  return rz
}
