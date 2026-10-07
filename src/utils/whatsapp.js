// Category-wise / service-wise WhatsApp routing.
//
//   1. an enquiry for a rental category goes to that category's number
//   2. otherwise, an enquiry about a specific service goes to that service's number
//   3. if neither has a number, it falls back to the default business number
//      configured in Admin → Settings / WhatsApp Routing.

export const digitsOnly = (v) => String(v || '').replace(/\D/g, '')

/** Resolve which number an enquiry must go to. */
export function resolveWhatsappNumber(category, settings, service = null) {
  return digitsOnly(category?.whatsapp) || digitsOnly(service?.whatsapp) || digitsOnly(settings?.defaultWhatsapp)
}

/** Where a number came from — shown in the admin and on the enquiry form. */
export function routeSource(category, service = null) {
  if (digitsOnly(category?.whatsapp)) return 'category'
  if (digitsOnly(service?.whatsapp)) return 'service'
  return 'default'
}

export function whatsappLink(number, message) {
  const n = digitsOnly(number)
  return `https://wa.me/${n}?text=${encodeURIComponent(message || '')}`
}

const brand = (siteName) => String(siteName || 'Smagizh').replace(/\s+Marketing$/i, '')

/**
 * Pre-filled enquiry message (format from the client's enquiry-flow design).
 * Empty fields are dropped so the customer only reviews what they entered.
 */
export function buildEnquiryMessage(payload, siteName) {
  const {
    name,
    mobile,
    business,
    category,
    subcategories,
    plan,
    service,
    location,
    inventory,
    budget,
    goal,
    contactTime,
    notes,
  } = payload || {}
  const b = brand(siteName)
  const subs = Array.isArray(subcategories) ? subcategories.filter(Boolean) : []

  const fields = [
    ['Name', name],
    ['Business', business],
    ['WhatsApp', mobile],
    ['Rental category', category],
    ['Rental types', subs.join(', ')],
    ['Plan', plan],
    ['Service', service],
    ['Service area', location],
    ['Inventory', inventory],
    ['Monthly marketing budget', budget],
    ['Primary goal', goal],
    ['Preferred contact time', contactTime],
    ['Requirements', notes],
  ]
    .filter(([, v]) => String(v || '').trim())
    .map(([k, v]) => `${k}: ${String(v).trim()}`)

  return [`Hello ${b}, I would like to promote my rental business.`, '', ...fields, '', `Sent from the ${b} website.`].join('\n')
}

/** Short message for "Chat on WhatsApp" buttons; carries the category / service in context. */
export function buildQuickMessage(siteName, categoryName, serviceName) {
  const b = brand(siteName)
  if (categoryName && serviceName)
    return `Hello ${b}, I am interested in ${serviceName} for my ${categoryName} business. Please share the details.`
  if (categoryName) return `Hello ${b}, I am interested in promoting my ${categoryName} business. Please share the details.`
  if (serviceName) return `Hello ${b}, I would like to know more about your ${serviceName} service for rental businesses.`
  return `Hello ${b}, I would like to know more about your digital marketing plans for rental businesses.`
}

export function openWhatsApp(number, message) {
  window.open(whatsappLink(number, message), '_blank', 'noopener,noreferrer')
}
