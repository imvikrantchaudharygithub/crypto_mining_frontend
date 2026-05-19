// Shared client-side cache for /site-settings. Navbar + WhatsApp FAB both
// need contact info — without this they'd each fire their own fetch on every
// page navigation.

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api'

export type SiteContact = {
  salesPhone?: string
  salesPhoneLabel?: string
  whatsappNumber?: string
  whatsappMessage?: string
  whatsappEnabled?: boolean
  salesEmail?: string
  supportEmail?: string
  workingHours?: string
}

export type SiteSettings = {
  brand?: { name?: string; tagline?: string; estYear?: string }
  contact?: SiteContact
}

// Sensible defaults so the buttons work even before the admin saves anything,
// and even if the API is down.
export const DEFAULT_CONTACT: Required<Pick<SiteContact, 'salesPhone' | 'salesPhoneLabel' | 'whatsappNumber' | 'whatsappMessage'>> & { whatsappEnabled: boolean } = {
  salesPhone: '+91 99119 44472',
  salesPhoneLabel: 'Call Us Now',
  whatsappNumber: '919911944472',
  whatsappMessage: "Hi, I'd like to know more about mining contracts.",
  whatsappEnabled: true,
}

let cache: SiteSettings | null = null
let pending: Promise<SiteSettings> | null = null

export function getCachedSiteSettings(): SiteSettings | null {
  return cache
}

export async function fetchSiteSettings(): Promise<SiteSettings> {
  if (cache) return cache
  if (pending) return pending
  pending = fetch(`${BASE}/site-settings`)
    .then((r) => r.json())
    .then((d) => {
      const settings = (d?.siteSettings ?? d ?? {}) as SiteSettings
      cache = settings
      pending = null
      return settings
    })
    .catch(() => {
      pending = null
      cache = {}
      return cache
    })
  return pending
}

/** Returns digits-only phone string for tel: / wa.me links. */
export function digitsOnly(phone: string): string {
  return (phone || '').replace(/\D+/g, '')
}
