import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cryptominingindia.com'

export const metadata: Metadata = {
  title: 'Contact Sales — Crypto Mining India',
  description:
    'Talk to our crypto mining experts in India. Call +91-99119-44472, WhatsApp, or email — pre-sales, hardware advice, setup support and warranty queries.',
  keywords: [
    'crypto mining contact india', 'antminer dealer contact', 'mining hardware support india',
    'cryptominingmiles contact', 'asic miner sales india',
  ],
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    url: `${SITE_URL}/contact`,
    title: 'Contact Crypto Mining India',
    description: 'Sales, support, and setup — reach our team on phone, WhatsApp, or email.',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}
