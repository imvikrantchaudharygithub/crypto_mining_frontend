import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://cryptominingindia.com'

export const metadata: Metadata = {
  title: 'Mining Profitability Calculator — Bitcoin ROI India',
  description:
    'Calculate Bitcoin mining profitability in India. Live BTC price, electricity cost in ₹/kWh, daily revenue and ROI for Antminer, Whatsminer and other ASIC miners.',
  keywords: [
    'bitcoin mining profitability', 'bitcoin mining calculator india', 'mining roi calculator',
    'antminer profitability', 'crypto mining profit india', 'asic mining calculator',
  ],
  alternates: { canonical: `${SITE_URL}/profitability` },
  openGraph: {
    url: `${SITE_URL}/profitability`,
    title: 'Mining Profitability Calculator — Crypto Mining India',
    description: 'See real Bitcoin mining ROI in ₹ before you buy your rig.',
  },
}

export default function ProfitabilityLayout({ children }: { children: React.ReactNode }) {
  return children
}
