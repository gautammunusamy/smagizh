/**
 * Thin wrapper around the PHP API.
 *
 * In production the React build and /api sit on the same domain, so requests
 * are same-origin and the admin session cookie just works. In development the
 * Vite proxy (see vite.config.js) forwards /api to a PHP server, which keeps
 * it same-origin there too.
 */

const BASE = import.meta.env.VITE_API_BASE || '/api'

class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request(path, { method = 'GET', body, form } = {}) {
  let res
  try {
    res = await fetch(`${BASE}/${path}`, {
      method,
      credentials: 'same-origin',
      headers: form ? undefined : body ? { 'Content-Type': 'application/json' } : undefined,
      body: form || (body ? JSON.stringify(body) : undefined),
    })
  } catch {
    throw new ApiError('Cannot reach the server. Check your internet connection.', 0)
  }

  const text = await res.text()
  let data
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    // A PHP fatal or an HTML error page rather than JSON.
    throw new ApiError(`Server returned an unexpected response (${res.status}).`, res.status)
  }

  if (!res.ok || data.ok === false) {
    throw new ApiError(data.error || `Request failed (${res.status}).`, res.status)
  }
  return data
}

export const api = {
  /** Everything the site renders, in one call. */
  content: () => request('content.php'),

  // ---- admin session ----
  me: () => request('auth.php?action=me'),
  login: (username, password) => request('auth.php?action=login', { method: 'POST', body: { username, password } }),
  logout: () => request('auth.php?action=logout', { method: 'POST' }),
  changePassword: (current, next) =>
    request('auth.php?action=password', { method: 'POST', body: { current, next } }),

  // ---- admin writes ----
  save: (resource, item) => request(`admin.php?resource=${resource}&action=save`, { method: 'POST', body: { item } }),
  remove: (resource, id) => request(`admin.php?resource=${resource}&action=delete`, { method: 'POST', body: { id } }),
  reorder: (resource, ids) => request(`admin.php?resource=${resource}&action=reorder`, { method: 'POST', body: { ids } }),
  replace: (resource, items) => request(`admin.php?resource=${resource}&action=replace`, { method: 'POST', body: { items } }),
  saveSettings: (item) => request('admin.php?resource=settings&action=save', { method: 'POST', body: { item } }),

  // ---- public ----
  submitEnquiry: (payload) => request('enquiry.php', { method: 'POST', body: payload }),

  // ---- payments (Razorpay) ----
  // Amounts always come from the server; the browser never sends a price.
  paymentPlans: () => request('payment.php?action=plans'),
  createOrder: (payload) => request('payment.php?action=create', { method: 'POST', body: payload }),
  verifyPayment: (payload) => request('payment.php?action=verify', { method: 'POST', body: payload }),
  cancelPayment: (payload) => request('payment.php?action=cancel', { method: 'POST', body: payload }),
  payments: () => request('payment.php?action=list'),

  upload: (file) => {
    const form = new FormData()
    form.append('file', file)
    return request('upload.php', { method: 'POST', form })
  },
}

export { ApiError }
